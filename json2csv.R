rm(list=ls())
library(plotrix)
library(lattice)
library(rjson)
library(ggplot2)
library(plyr)
library(chron)
library(stringr)

#utility functions for eyeballing significance
sem <- function(x) {sd(x)/sqrt(length(x))}
ci95 <- function(x) {1.96*sem(x)}

## get the .results file that submiterator script spits out

#all_results <- list.files(path = "/Applications/MAMP/htdocs/projects/ja_xsit/ja_xsit_social_4_3_pilot2/", pattern = '*.results', all.files = FALSE);
all_results <-  list.files(path = "/Applications/MAMP/htdocs/projects/ja_xsit/ja_xsit_social_4_3_pilot2/", pattern = '*nosoc.results', all.files = FALSE);

## Create empty data frame
all.data <- as.data.frame(matrix(ncol = 0, nrow = 0))

# the main loop through all of the conditions
for(f in 1:length(all_results)) {
  
  data <- read.table(paste("/Applications/MAMP/htdocs/projects/ja_xsit/ja_xsit_social_4_3_pilot2/", all_results[f],sep=""),sep="\t",header=TRUE, 
                     stringsAsFactors=FALSE)
  
  long.data <- as.data.frame(matrix(ncol = 0, nrow = 20*nrow(data)))
}
  
  c <- 1
  
  for (i in 1:nrow(data)) {
    d <- fromJSON(as.character(data$Answer.data[i]))
    
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
  long.data$numPic <- unlist(subs)[4];

  # get interval from file names
  interval <- unlist(subs)[5];
  long.data$interval <- interval;

#grab only the continuation trials
  long.data$test <- 0 

  # this is super ugly
  if (interval == 0) {
    long.data$test[long.data$trial.num==6 |
                     long.data$trial.num==8 |
                     long.data$trial.num==10 |
                     long.data$trial.num==12 |
                     long.data$trial.num==14 |
                     long.data$trial.num==16 |
                     long.data$trial.num==18 |
                     long.data$trial.num==20] <- 1;
  } else if(interval == 1){
    long.data$test[long.data$trial.num==7 |
                     long.data$trial.num==8 |
                     long.data$trial.num==11 |
                     long.data$trial.num==12 |
                     long.data$trial.num==15 |
                     long.data$trial.num==16 |
                     long.data$trial.num==19 |
                     long.data$trial.num==20] <- 1;
  } else if(interval == 3){
    long.data$test[long.data$trial.num==9 |
                     long.data$trial.num==10 |
                     long.data$trial.num==11 |
                     long.data$trial.num==12 |
                     long.data$trial.num==17 |
                     long.data$trial.num==18 |
                     long.data$trial.num==19 |
                     long.data$trial.num==20] <- 1;  
  } else if(interval == 7){
    long.data$test[long.data$trial.num==13 |
                     long.data$trial.num==14 |
                     long.data$trial.num==15 |
                     long.data$trial.num==16 |
                     long.data$trial.num==17 |
                     long.data$trial.num==18 |
                     long.data$trial.num==19 |
                     long.data$trial.num==20] <- 1;  
  }
  
#grab only the exposure trials
# this is super ugly

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
} else if(interval == 1){
  long.data$exposure[long.data$trial.num==7 |
                   long.data$trial.num==8 |
                   long.data$trial.num==11 |
                   long.data$trial.num==12 |
                   long.data$trial.num==15 |
                   long.data$trial.num==16 |
                   long.data$trial.num==19 |
                   long.data$trial.num==20] <- 1;
} else if(interval == 3){
  long.data$exposure[long.data$trial.num==5 |
                   long.data$trial.num==6 |
                   long.data$trial.num==7 |
                   long.data$trial.num==8 |
                   long.data$trial.num==13 |
                   long.data$trial.num==14 |
                   long.data$trial.num==15 |
                   long.data$trial.num==16] <- 1;  
} else if(interval == 7){
  long.data$exposure[long.data$trial.num==13 |
                   long.data$trial.num==14 |
                   long.data$trial.num==15 |
                   long.data$trial.num==16 |
                   long.data$trial.num==17 |
                   long.data$trial.num==18 |
                   long.data$trial.num==19 |
                   long.data$trial.num==20] <- 1;  
}

all.data <- rbind(all.data,long.data);

#compute day/time of each hit for excluding multiples
all.data$day.and.time <- chron(dates = all.data$submit.date,
                               times = all.data$submit.time,
                               format=c("mon d y","h:m:s"))

all.data <- all.data[with(all.data,order(subid,day.and.time)),]

drop.subs <- ddply(all.data,.(subid),
                      function(x) {nrow(x) > 20})
drop.subs <- drop.subs[drop.subs$V1,1]

#grab earliest HIT for each participant
all.drops <- matrix(0,nrow(all.data))
for(sub in drop.subs) {
  rows <- as.integer(all.data$subid == sub)
  all.drops[rows & (cumsum(rows) > 20)] <- 1
}
all.data <- subset(all.data,!all.drops)

## recode subid as factor and recode trial type as factor with two levels: Same and Switch
all.data$subid <- as.factor(all.data$subid)
all.data$trialType <- factor(all.data$trialType, labels = c('Same','Switch'))
example.data <- all.data[nchar(all.data$kept) == 0,]

#Grab exposure data
exposure.data <- all.data[all.data$exposure == 1,]
# check if participants are selecting the target of eye gaze on exposure trials
exposure.data$faceIdx <- revalue(exposure.data$face, c("eyesleft"=0, "eyesdownleftarrow"=1, "eyesdownrightarrow"=2, "eyesrightarrow"=3, "eyescenter"=-1))
exposure.data$choseSocial <- exposure.data$faceIdx == exposure.data$chosenIdx
exposure.data$choseSocial[exposure.data$faceIdx==-1] <- NA

# calculate means for correctly choosing exposure data
mean(exposure.data$choseSocial,na.rm=TRUE)
# only look at first trial
mean(exposure.data$choseSocial[exposure.data$trial.num==5],na.rm=TRUE)

### Grab test data

test.data <- all.data[all.data$test ==  1,]
test.data$correct <- test.data$chosen == test.data$kept
mean(test.data$correct)

test.data$trialType <- factor(test.data$trialType, labels = c('Same','Switch'))
test.data <- test.data[with(test.data, order(subid,trial.num)),]

# exclude for getting examples wrong
include.subs <- ddply(example.data,.(subid),
            function(x) {x$chosen[1] == "squirrel" & 
                           x$chosen[2] == "squirrel" & 
                           x$chosen[3] == "tomato" &
                           x$chosen[4] == "tomato"})

names(include.subs) <- c("subid","include")
test.data <- merge(test.data,include.subs,sort = FALSE)

keep.data <- subset(test.data,include)

keep.data$first.trial <- FALSE
keep.data$first.trial[(keep.data$interval==0 & keep.data$trial.num==6) |
                        (keep.data$interval==1 & keep.data$trial.num==7) |
                        (keep.data$interval==3 & keep.data$trial.num==9) |
                        (keep.data$interval==7 & keep.data$trial.num==13)] <- TRUE


keep.data$numPicN <- as.numeric(keep.data$numPic)
keep.data$intervalN <- as.numeric(keep.data$interval)

#renumber trials to be consistent across conditions
trial.nums <- function(x) {
  xmod <- x
  nums <- x$trial.num

  for (i in 1:length(nums)) {
    xmod$trial.num[xmod$trial.num==nums[i]] <- i
  }
  
  return(xmod)
}

# just some quick aggregate calls to look at means by condition
mss <- aggregate(correct ~ numPic + intervalN + trialType + subid , data=keep.data,FUN=mean)
mssrt <- aggregate(rt ~ numPic + intervalN + trialType + subid , data=keep.data,FUN=mean)

ms <- aggregate(correct ~ numPic + intervalN + trialType , data=mss,FUN=mean)
msrt <- aggregate(rt ~ numPic + intervalN + trialType , data=mssrt,FUN=mean)

ms$err <- aggregate(correct ~ numPic + interval + trialType, data=mss,FUN=ci95)$correct

## Save test and exposure tables as .csv

write.csv(keep.data,"/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_pilot2_4_3_nosocial_test.csv")
write.csv(exposure.data,"/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_pilot2_4_3_social_exposure.csv")


# write.csv(mss,"/Applications/MAMP/htdocs/projects/ja_xsit/ja_xsit_4_0_no_soc_means.csv")
# write.csv(keep.data,"/Applications/MAMP/htdocs/projects/ja_xsit/ja_xsit_4_0_no_soc_long.csv")