rm(list=ls())
library(plotrix)
library(lattice)
library(rjson)
library(ggplot2)
library(plyr)
library(chron)
library(stringr)

# sets up utility functions for eyeballing significance
sem <- function(x) {sd(x)/sqrt(length(x))}
ci95 <- function(x) {1.96*sem(x)}

## gets all .results files at one time
all_results <- list.files(path = "/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/raw_data", pattern = '*.results', all.files = FALSE)

## creates empty data frame
all.data <- as.data.frame(matrix(ncol = 0, nrow = 0))

## loops through all of the results files, grabbing relevant data from JSON, creating columns for 
## the following: condition (soc/no_soc), number of pics each trial, interval between exposure and test  
## also flags test and exposure trials

for(f in 1:length(all_results)) {
  data <- read.table(paste("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/raw_data/", all_results[f],sep=""),sep="\t",header=TRUE, 
                     stringsAsFactors=FALSE)
  long.data <- as.data.frame(matrix(ncol = 0, nrow = 20*nrow(data)))
  c <- 1
  
  # loops over each participant
  for (i in 1:nrow(data)) {
    
    d <- fromJSON(as.character(data$Answer.data[i]))
    # grab fields from JSON
    for (j in 1:length(d)) {
      
      #grab relevant fields from the JSON mess
      long.data$subid[c] <- data$workerid[i]
      long.data$submit.date[c] <-  paste(word(data$assignmentsubmittime[i],
                                              start=2,end=3),
                                         word(data$assignmentsubmittime[i]
                                              ,start=-1L))
      long.data$submit.time[c] <-  word(data$assignmentsubmittime[i]
                                              ,start=4)
      long.data$trial.num[c] <- j
      long.data$itemNum[c] <- d[[j]]$itemNum
      long.data$trialType[c] <- d[[j]]$trialType
      long.data$samePos[c] <- d[[j]]$samePos
      long.data$chosen[c] <- d[[j]]$chosen
      long.data$chosenIdx[c] <- d[[j]]$chosen_idx
      long.data$kept[c] <- d[[j]]$kept
      long.data$keptIdx[c] <- d[[j]]$kept_idx
      long.data$rt[c] <- d[[j]]$rt
      long.data$face[c] <- d[[j]]$face
      c <- c + 1
    }
  }
  
  #get numpic from file names
  subs <- strsplit(all_results[f],'\\.');
  subs <- strsplit(unlist(subs)[1],'_');
  long.data$numPic <- unlist(subs)[3];
  
  # get interval from file names
  interval <- unlist(subs)[4];
  long.data$interval <- interval;
  
  # get condition from file names 
  condition <- unlist(subs)[6]
  long.data$condition <- condition;
  
  # flag the continuation trials
  long.data$test <- 0 
  
  if (interval == 0) {
    long.data$test[long.data$trial.num==6 |
                    long.data$trial.num==8 |
                    long.data$trial.num==10 |
                    long.data$trial.num==12 |
                    long.data$trial.num==14 |
                    long.data$trial.num==16 |
                    long.data$trial.num==18 |
                    long.data$trial.num==20] <- 1;
  } else if (interval == 3) {
    long.data$test[long.data$trial.num==9 |
                    long.data$trial.num==10 |
                    long.data$trial.num==11 |
                    long.data$trial.num==12 |
                    long.data$trial.num==17 |
                    long.data$trial.num==18 |
                    long.data$trial.num==19 |
                    long.data$trial.num==20] <- 1;  
  } 
  
  # flag exposure trials
  
  long.data$exposure <- 0 
  
  if (interval == 0) {
    long.data$exposure[long.data$trial.num==5 |
                        long.data$trial.num==7 |
                        long.data$trial.num==9 |
                        long.data$trial.num==11 |
                        long.data$trial.num==13 |
                        long.data$trial.num==15 |
                        long.data$trial.num==17 |
                        long.data$trial.num==19] <- 1;
    
  } else if (interval == 3) {
    long.data$exposure[long.data$trial.num==5 |
                        long.data$trial.num==6 |
                        long.data$trial.num==7 |
                        long.data$trial.num==8 |
                        long.data$trial.num==13 |
                        long.data$trial.num==14 |
                        long.data$trial.num==15 |
                        long.data$trial.num==16] <- 1;    
  }
  
  all.data <- rbind(all.data,long.data);
  
}

## -------------- CLEAN DATASET -------------- ##

## computes day/time of each hit for excluding multiples
all.data$day.and.time <- chron(dates = all.data$submit.date,
                               times = all.data$submit.time,
                               format=c("mon d y","h:m:s"))

all.data <- all.data[with(all.data,order(subid,day.and.time)),]

drop.subs <- ddply(all.data,.(subid),
                      function(x) {nrow(x) > 20})

drop.subs <- drop.subs[drop.subs$V1,1] # grabs subs who participated more than once

## grabs earliest HIT for each participant
all.drops <- matrix(0,nrow(all.data))

for(sub in drop.subs) {
  rows <- as.integer(all.data$subid == sub)
  all.drops[rows & (cumsum(rows) > 20)] <- 1
}
all.data <- subset(all.data,!all.drops) ## subsets data without subs who participated twice

## recodes subid as factor and recode trial type as factor with two levels: Same and Switch
all.data$subid <- as.factor(all.data$subid)
all.data$trialType <- factor(all.data$trialType, labels = c('Same','Switch'))

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
            function(x) {x$chosen[1] == "squirrel" & 
                           x$chosen[2] == "squirrel" & 
                           x$chosen[3] == "tomato" &
                           x$chosen[4] == "tomato"})

names(include.subs) <- c("subid","include")

# merges include column to data frame
all.data <- merge(all.data,include.subs,sort = FALSE)

# keeps just the subs who responded accurately on example trials
keep.data <- subset(all.data,include)

## flag first trials ##  
keep.data$first.trial <- FALSE
keep.data$first.trial[(keep.data$interval==0 & keep.data$trial.num==6) |
                        (keep.data$interval==3 & keep.data$trial.num==9)] <- TRUE

# creates numeric vars for data analysis 
keep.data$numPicN <- as.numeric(keep.data$numPic)
keep.data$intervalN <- as.numeric(keep.data$interval)

# flags correct/incorrect on same/switch trials
keep.data$correct <- keep.data$chosen == keep.data$kept

# removes example trials to just keep test and exposure in final dataset
keep.data <- subset(keep.data, keep.data$trial.num > 4)

## -------------- SAVE OUTPUT -------------- ##

## Save test and exposure tables as .csv
write.csv(keep.data, "/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/processed_data/soc_xsit_all_data.csv")
