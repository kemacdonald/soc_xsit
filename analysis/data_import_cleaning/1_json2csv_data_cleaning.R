##### GET RELEVANT FIELDS FROM JSON OUTPUT #####

# Clear workspace
rm(list=ls())

## Load libraries 
library(chron)
library(rjson)
library(plyr)
library(dplyr)
library(stringr)


## set path for writing data (same for all three experiments)
write_path <- file.path("/Users", "kmacdonald", "Documents", "Projects", "SOC-XSIT", "SOC_XSIT_GIT", "data/", "raw_not_anonymized/")

##### Experiment 1: Soc-xsit Schematic ######

##### Experiment 2: Soc-xsit Human ######


##### Experiment 3: Soc-xsit Reliability #####

## number of trials in experiment
num_trials <- 34

## set file paths for reading  data
setwd("../../../expts/final/e3_soc_xsit_reliability/data/")

## gets all .results files at one time
all_results <- list.files(pattern = '*.results', all.files = FALSE)
## grab just the confirmatory replication experiment
all_results <- c(all_results[5])

## creates empty data frame for storing data
all.data <- data.frame()

## loops through all of the results files, grabbing relevant data from JSON, creating columns for 
## the following: condition (soc/no_soc), number of pics each trial, interval between exposure and test  
## also flags test and exposure trials

for(f in 1:length(all_results)) {
  data <- read.table(paste(all_results[f], sep=""), sep="\t", 
                     header=TRUE, stringsAsFactors=FALSE)
  long.data <- as.data.frame(matrix(ncol = 0, nrow = num_trials*nrow(data)))
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
      long.data$condition[c] <- fromJSON(as.character(data$Answer.prop_cond[i]))       
      long.data$interval[c] <- fromJSON(as.character(data$Answer.delay_condition[i]))  
      long.data$numPic[c] <- fromJSON(as.character(data$Answer.numReferents[i]))
      long.data$browser[c] <- fromJSON(as.character(data$Answer.browser[i]))
      long.data$comments[c] <- fromJSON(as.character(data$Answer.broken[i]))
      long.data$itemNum[c] <- d[[j]]$itemNum
      long.data$trialType[c] <- d[[j]]$trialType
      long.data$samePos[c] <- d[[j]]$samePos
      long.data$chosen[c] <- d[[j]]$chosen
      long.data$correct[c] <- d[[j]]$correct
      long.data$chosenIdx[c] <- d[[j]]$chosen_idx
      long.data$gaze_target[c] <- d[[j]]$gaze_target
      long.data$trial_category[c] <- d[[j]]$trial_category
      long.data$kept[c] <- d[[j]]$kept
      long.data$keptIdx[c] <- d[[j]]$kept_idx
      long.data$rt[c] <- d[[j]]$rt
      long.data$face[c] <- d[[j]]$face
      long.data$faceIdx[c] <- d[[j]]$faceIdx
      long.data$rel_subj[c] <- data$Answer.reliability[i]
     
      c <- c + 1
    }
  }
}  

## rbind the two different delay conditions together
# long.data <- rbind(long.data, long.data1)

## create variables for tracking exposure and test trials
#exposure_trials_3delay <- c(5,6,7,8,13,14,15,16,21,22,23,24,29,30,31,32)
#test_trials_3delay <- c(9,10,11,12,17,18,19,20,25,26,27,28,33,34,35,36)

### revalue condition variable for reliablity experiment
#long.data$prop_cond <- revalue(as.character(long.data$condition), 
#                               c("1" = "100same0switch", "2" = "0same100switch"))

# ## Flag exposure, test, and example trials (within subs experiment)
# long.data <- long.data %>% 
#     group_by(subid) %>%
#     mutate(trial_cat = if (interval == "Zero") {ifelse(trial.num %in% seq(1,4), "example", 
#                                                        ifelse(trial.num %in% seq(from=5, to=35, by=2), "exposure",
#                                                               ifelse(trial.num %in% seq(from=6, to=36, by=2), "test",
#                                                                      NA)))
#     } else {
#         ifelse(trial.num %in% seq(1,4), "example", 
#                ifelse(trial.num %in% exposure_trials_3delay, "exposure",
#                       ifelse(trial.num %in% test_trials_3delay, "test",
#                              NA)))
#     }) %>%
#     arrange(subid, trial.num)

all.data <- long.data

##### CLEAN DATASET #####

# computes day/time of each hit for excluding multiples
all.data$day.and.time <- chron(dates = all.data$submit.date,
                               times = all.data$submit.time,
                               format=c("mon d y","h:m:s"))

all.data <- all.data[with(all.data,order(subid,day.and.time)),]

# drop subs who have more than 36 trials
drop.subs <- ddply(all.data,.(subid), function(x) {nrow(x) > 34}) 

# grabs subs who participated more than once
drop.subs <- drop.subs[drop.subs$V1,1] 

# grabs earliest HIT for each participant
all.drops <- matrix(0,nrow(all.data))

for(sub in drop.subs) {
  rows <- as.integer(all.data$subid == sub)
  all.drops[rows & (cumsum(rows) > 20)] <- 1
}

## subsets data without subs who participated twice
all.data <- subset(all.data,!all.drops) 

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
example.data <- filter(all.data, trial_category == "example")
include.subs <- ddply(example.data,.(subid),
            function(x) {x$chosen[1] == "squirrel" & 
                           x$chosen[2] == "tomato"})

names(include.subs) <- c("subid","include")

# merges include column to data frame
all.data <- merge(all.data,include.subs,sort = FALSE)

# keeps just the subs who responded accurately on example trials
keep.data <- subset(all.data,include)

## flag first test trials for subjects ##  
keep.data$first.trial <- FALSE
keep.data$first.trial[(keep.data$interval=="Zero" & keep.data$trial.num==4) |
                        (keep.data$interval=="One" & keep.data$trial.num==7) |
                        (keep.data$interval=="Three" & keep.data$trial.num==9) |
                        (keep.data$interval=="Seven" & keep.data$trial.num==13)] <- TRUE

# creates numeric vars for data analysis 
keep.data$numPicN <- as.numeric(keep.data$numPic)

# flags correct/incorrect on same/switch trials
# keep.data$correct <- keep.data$chosen == keep.data$kept

# revalue faceIdx
# keep.data$faceIdx <- revalue(keep.data$face, 
#                             c("silentLUlong"= 0, "silentLUmedium" = 0,
#                               "silentLUshort"= 0, "LUkidslonger" = 0,
#                               "noisyLU" = 0, "up-left-4sec" = 0,
#                               "silentRUlong" = 1, "silentRUmedium"= 1,
#                               "silentRUshort" = 1, "RUkidslonger" = 1,
#                               "noisyRU" = 1, "up-right-4sec" = 1,
#                               "silentLDlong" = 2, "silentLDmedium" = 2,
#                               "silentLDshort" = 2, "LDkidslonger" = 2,
#                               "noisyLD" = 2, "down-left-4sec" = 2,
#                               "silentRDlong" = 3, "silentRDmedium" = 3,
#                               "silentRDshort" = 3, "RDkidslonger" = 3, 
#                               "noisyRD" = 3, "down-right-4sec" = 3,
#                               "straightahead" = -1, "straightaheadlonger" = -1,
#                               "straight-ahead" = -1))


# flag correct on all trial categories (example, exposure, test)
# keep.data <- keep.data  %>% 
#     group_by(subid) %>%
#     mutate(correct = ifelse(trial_category == "example", chosen[1] == "squirrel" | 
#                                 chosen[2] == "tomato",
#                             ifelse(trial_category == "exposure", chosen == gaze_target,
#                                    ifelse(trial_category == "test" , chosen == kept, NA)
#                             )))

# create block variable
keep.data$block <- ifelse(keep.data$itemNum <= 7, "familiarization", "test")

##### SAVE OUTPUT  #####

write.csv(keep.data, paste(write_path, "soc_xsit_reliabiliy_parametric_replication.csv", sep=""),
          row.names=FALSE)
