##### MERGE SOC_XSIT BATCHES TO CREATE MASTER DATA FILE  #####
rm(list=ls())
library(plotrix)
library(lattice)
library(rjson)
library(ggplot2)
library(plyr)
library(chron)
library(car)
library(stringr)
library(compare)

##### READ IN DATA #####

setwd("/Users/kmacdonald/Documents/Projects/SOC_XSIT/processed_data/replicate_processing")

d.km.2 <- read.csv("soc_xsit_2.csv")
d.km.4.batch1.1 <- read.csv("soc_xsit_4-batch1-1.csv")
d.km.4.batch1.2 <- read.csv("soc_xsit_4-batch1-2.csv")
d.km.4.batch2 <- read.csv("soc_xsit_4-batch2.csv")
d.km.6 <- read.csv("soc_xsit_6.csv")
d.km.8 <- read.csv("soc_xsit_8.csv")
d.dy <- read.csv("dy_expt2_long.csv") 

# grab just the 2, 4, and 8 referent conditions from dan's data
d.dy <- subset(d.dy, (numPicN==2) | (numPicN==4) | (numPicN==8)) 

# clean up datasets for merging with rbind() (vertical merge)
d.dy$test <- NULL
d.dy$condition <- "No-Social"
colnames(d.dy)[21] <- "intervalNum"
d.dy$testTrial <- 1 # dan only sent test trials


# track which expt data come from
d.dy$dataset <- "dy" 
d.km.2$dataset <- "km"
d.km.4.batch1.1$dataset <- "km"
d.km.4.batch1.2$dataset <- "km"
d.km.4.batch2$dataset <- "km"
d.km.6$dataset <- "km"
d.km.8$dataset <- "km"

## bind together using rbind.fill, missing values become NAs
d <- rbind.fill(d.dy, d.km.2, d.km.4.batch1.1,
                d.km.4.batch1.2, d.km.4.batch2, 
                d.km.6, d.km.8)

## sort by subid and dataset - putting dan's data set first
d <- d[with(d,order(subid, dataset)),]

##### CLEAN DATA #####
length(unique(d$subid)) # check number of participants

## get number of subjects in each condition 
numSubs <- aggregate(correct ~ subid + condition + intervalNum + numPicN, data=d, FUN=mean)
numSubs <- numSubs[with(numSubs, order(subid)),]
numSubs.summary <- count(numSubs, vars=c("condition", "intervalNum", "numPicN"))

## check if there are duplicate subids
length(numSubs$subid) - length(unique(numSubs$subid))

## find duplicates
dups <- unique(numSubs$subid[duplicated(numSubs$subid)])

##### REMOVE DUPLICATES #####

# sort by subid and day/time to keep earlier hit
d <- d[with(d,order(subid,day.and.time)),]

drop.subs <- ddply(d,.(subid),
                   function(x) {nrow(x) > 20})

drop.subs <- drop.subs[drop.subs$V1,1] # grabs subs who participated more than once

# grabs earliest HIT for each participant
all.drops <- matrix(0,nrow(d))

for(sub in drop.subs) {
  rows <- as.integer(d$subid == sub)
  all.drops[rows & (cumsum(rows) > 20)] <- 1
}

d <- subset(d,!all.drops) ## subsets data without subs who participated twice


## remove subs who participated in Dan's and my experiment, keeping Dan's data
numSubs.2 <- aggregate(correct ~ subid + condition + intervalNum + numPicN, data=d, FUN=mean)
numSubs.2.summary <- count(numSubs.2, vars=c("condition", "intervalNum", "numPicN"))

## check if there are duplicate subids
length(numSubs.2$subid) - length(unique(numSubs.2$subid))

## find duplicates
dups.2 <- unique(numSubs.2$subid[duplicated(numSubs.2$subid)])

drop.subs.2 <- dups.2 # grabs subs who participated more than once

# grabs earliest HIT for each participant
all.drops.2 <- matrix(0,nrow(d))

for(sub in drop.subs.2) {
  rows <- as.integer(d$subid == sub)
  all.drops.2[rows & (cumsum(rows) > 8)] <- 1
}

d <- subset(d,!all.drops.2) ## subsets data without subs who participated twice

# check if there are duplicate subids after filtering out
numSubs.3 <- aggregate(correct ~ subid + condition + intervalNum + numPicN, data=d, FUN=mean)
numSubs.3.summary <- count(numSubs.3, vars=c("condition", "intervalNum", "numPicN"))
length(numSubs.3$subid) - length(unique(numSubs.3$subid))

# remove +/- 2SD
d$rt[log(d$rt) > mean(log(d$rt)) + 2* sd(log(d$rt)) | 
       log(d$rt) < mean(log(d$rt)) - 2* sd(log(d$rt))] <- NA

## Save as .csv
write.csv(d, "/Users/kmacdonald/Documents/Projects/SOC_XSIT/processed_data/soc_xsit_expt1_master.csv")

