##### GET RELEVANT FIELDS FROM JSON OUTPUT #####
##### Experiment 1: Soc-xsit Schematic #####

# Clear workspace
rm(list=ls())

## Load libraries 
library(chron)
library(car)
library(rjson)
library(plyr)
library(dplyr)
library(stringr)

setwd("1_raw_not_anonymized/e1_schematic/")

# read raw data
all_results <- list.files(pattern = '*.results', all.files = FALSE)

## number of trials in experiment
num_trials <- 20

## creates empty data frame for storing data
all.data <- data.frame()

## loops through all of the results files, grabbing relevant data from JSON, creating columns for 
## the following: condition (soc/no_soc), number of pics each trial, interval between exposure and test  

for(f in 1:length(all_results)) {
  data <- read.table(paste(all_results[f], sep=""), sep="\t", 
                     header=TRUE, stringsAsFactors=FALSE)
  long.data <- as.data.frame(matrix(ncol = 0, nrow = num_trials*nrow(data)))
  c <- 1
  
  if ( all_results[f] == "soc_xsit_4.results") {
    condition_name <- "Answer.socialCond"
    delay_cond <- "Answer.numIntWordsCond"
  } else {
    condition_name <- "Answer.social_cond"
    delay_cond <- "Answer.delay_condition"
  }
  
  # loops over each participant
  for (i in 1:nrow(data)) {   
    # create list of trial information to allow for iteration
    d <- fromJSON(as.character(data$Answer.data[i])) 
    
    # grab fields from JSON
    for (j in 1:length(d)) {
      long.data$subid[c] <- data$workerid[i]
      long.data$submit.date[c] <-  paste(word(data$assignmentsubmittime[i], start=2,end=3),
                                         word(data$assignmentsubmittime[i], start=-1L))
      long.data$submit.time[c] <-  word(data$assignmentsubmittime[i],start=4)
      long.data$trial.num[c] <- j
      long.data$condition[c] <- fromJSON(as.character(data[condition_name][i,]))
      long.data$interval[c] <- fromJSON(as.character(data[delay_cond][i,]))  
      long.data$numPic[c] <- fromJSON(as.character(data$Answer.numReferents[i]))
      long.data$comments[c] <- fromJSON(as.character(data$Answer.broken[i]))
      long.data$itemNum[c] <- d[[j]]$itemNum
      long.data$trialType[c] <- d[[j]]$trialType
      long.data$samePos[c] <- d[[j]]$samePos
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

# sanity check: make sure we have the right number of ss
length(unique(long.data$subid))

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
all.data$intervalNum <- car::recode(all.data$interval, "'Zero'=0; 'One'=1; 'Three'=3; 'Seven'=7", as.factor.result=FALSE)

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

# create block variable
keep.data$block <- ifelse(keep.data$itemNum <= 7, "familiarization", "test")

##### SAVE OUTPUT  #####

#write.csv(keep.data, paste(write_path, "e3_soc_xsit_reliabiliy_parametric_replication.csv", sep=""),
 #         row.names=FALSE)
