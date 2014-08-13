##### GET RELEVANT FIELDS FROM JSON OUTPUT #####

## Load libraries 
library(plotrix)
library(lattice)
library(rjson)
library(plyr)
library(dplyr)
library(chron)
library(car)
library(stringr)

## set file paths for reading and writing data
read_path <- file.path("/Users", "kmacdonald", "Documents", "Projects", "SOC_XSIT", "soc_xsit_expts", "soc_xsit_4_looks/")
write_path <- file.path("/Users", "kmacdonald", "Documents", "Projects", "SOC_XSIT", "processed_data", "adult-looks/")

## gets all .results files at one time
all_results <- list.files(path = read_path, pattern = '*.results', all.files = FALSE)

all_results <- all_results[2] ## within subs expt
all_results <- all_results[3] ## this/one btw subs expt

## creates empty data frame
all.data <- data.frame()

## loops through all of the results files, grabbing relevant data from JSON, creating columns for 
## the following: condition (soc/no_soc), number of pics each trial, interval between exposure and test  
## also flags test and exposure trials

for(f in 1:length(all_results)) {
  data <- read.table(paste(read_path, all_results[f],sep=""), sep="\t", 
                     header=TRUE, stringsAsFactors=FALSE)
  long.data <- as.data.frame(matrix(ncol = 0, nrow = 16*nrow(data)))
  c <- 1
  # loops over each participant
  for (i in 1:nrow(data)) {    
    # create list of trial information to allow for iteration
    d <- fromJSON(as.character(data$Answer.data[i])) 
    
    # grab fields from JSON
    for (j in 1:length(d)) {
      long.data$subid[c] <- data$workerid[i]
      long.data$submit.date[c] <-  paste(word(data$assignmentsubmittime[i],
                                              start=2,end=3),
                                         word(data$assignmentsubmittime[i]
                                              ,start=-1L))
      long.data$submit.time[c] <-  word(data$assignmentsubmittime[i]
                                              ,start=4)
      long.data$trial.num[c] <- j
      long.data$gazeLength[c] <- fromJSON(as.character(data$Answer.condition[i]))       
      long.data$condition[c] <- fromJSON(as.character(data$Answer.social_cond[i]))       
      long.data$interval[c] <- fromJSON(as.character(data$Answer.delay_condition[i]))  
      long.data$numPic[c] <- fromJSON(as.character(data$Answer.numReferents[i]))
      long.data$browser[c] <- fromJSON(as.character(data$Answer.browser[i]))
      long.data$itemNum[c] <- d[[j]]$itemNum
      long.data$trialType[c] <- d[[j]]$trialType
      ## long.data$samePos[c] <- d[[j]]$samePos
      long.data$chosen[c] <- d[[j]]$chosen
      long.data$chosenIdx[c] <- d[[j]]$chosen_idx
      long.data$kept[c] <- d[[j]]$kept
      long.data$keptIdx[c] <- d[[j]]$kept_idx
      long.data$rt[c] <- d[[j]]$rt
      long.data$face[c] <- d[[j]]$face
      long.data$faceIdx[c] <- d[[j]]$faceIdx
     
      c <- c + 1
    }
  }
}  

## Flag exposure, test, and example trials
long.data <- long.data %>% 
        group_by(subid) %>%
        mutate(example_trial = ifelse(trial.num %in% seq(1,4),1,0),
               exposure_trial = ifelse(trial.num %in% seq(from=5, to=15, by=2),1,0),
               test_trial = ifelse(trial.num %in% seq(from=6, to=16, by=2),1,0)) %>%
        arrange(subid, trial.num)

all.data <- long.data

##### CLEAN DATASET #####

## computes day/time of each hit for excluding multiples
all.data$day.and.time <- chron(dates = all.data$submit.date,
                               times = all.data$submit.time,
                               format=c("mon d y","h:m:s"))

all.data <- all.data[with(all.data,order(subid,day.and.time)),]

drop.subs <- ddply(all.data,.(subid),
                      function(x) {nrow(x) > 16})

drop.subs <- drop.subs[drop.subs$V1,1] # grabs subs who participated more than once

# grabs earliest HIT for each participant
all.drops <- matrix(0,nrow(all.data))

for(sub in drop.subs) {
  rows <- as.integer(all.data$subid == sub)
  all.drops[rows & (cumsum(rows) > 16)] <- 1
}

all.data <- subset(all.data,!all.drops) ## subsets data without subs who participated twice

# recodes subid as factor and recode trial type as factor with two levels: Same and Switch
all.data$subid <- as.factor(all.data$subid)
all.data$trialType <- factor(all.data$trialType, labels = c('Same','Switch'))

# recode interval as numeric for plotting
all.data$intervalNum <- recode(all.data$interval, "'Zero'=0; 'One'=1; 'Three'=3; 'Seven'=7", as.factor.result=FALSE)

# renumbers trials to be consistent across conditions
trial.nums <- function(x) {
  xmod <- x
  nums <- x$trial.num
  
  for (i in 1:length(nums)) {
    xmod$trial.num[xmod$trial.num==nums[i]] <- i
  }
  
  return(xmod)
}

## excludes subjects for getting example trials wrong

# grabs example data
example.data <- all.data[all.data$trial.num == 1:4, ]
include.subs <- ddply(example.data,.(subid),
            function(x) {x$chosen[1] == "flower" & 
                           x$chosen[2] == "flower" & 
                           x$chosen[3] == "truck" &
                           x$chosen[4] == "truck"})

names(include.subs) <- c("subid","include")

# merges include column to data frame
all.data <- merge(all.data,include.subs,sort = FALSE)

# keeps just the subs who responded accurately on example trials
keep.data <- subset(all.data,include)

## flag first test trials for subjects ##  
keep.data$first.trial <- FALSE
keep.data$first.trial[(keep.data$interval=="Zero" & keep.data$trial.num==6) |
                        (keep.data$interval=="One" & keep.data$trial.num==7) |
                        (keep.data$interval=="Three" & keep.data$trial.num==9) |
                        (keep.data$interval=="Seven" & keep.data$trial.num==13)] <- TRUE

# creates numeric vars for data analysis 
keep.data$numPicN <- as.numeric(keep.data$numPic)

# flags correct/incorrect on same/switch trials
keep.data$correct <- keep.data$chosen == keep.data$kept

# anonymize subject ids

keep.data <- anonymize.sids(keep.data, "subid")

##### SAVE OUTPUT  #####

write.csv(keep.data, paste(write_path, "soc_xsit_looks_pilot_4_thisone_btw.csv", sep=""),
          row.names=FALSE)
