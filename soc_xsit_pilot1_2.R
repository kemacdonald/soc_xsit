rm(list=ls())
library(bootstrap)
library(lme4)
library(ggplot2)
library(arm)
library(directlabels)
library(stringr)
library(plyr)
library(reshape2)
options(device="quartz")

## code for bootstrapping 95% confidence intervals
theta <- function(x,xdata,na.rm=T) {mean(xdata[x],na.rm=na.rm)}
ci.low <- function(x,na.rm=T) {
  mean(x,na.rm=na.rm) - quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.025,na.rm=na.rm)}
ci.high <- function(x,na.rm=T) {
  quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.975,na.rm=na.rm) - mean(x,na.rm=na.rm)}

## -------------- READ IN AND CLEAN DATA --------------

### read data
social_4_3 <- read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_pilot2_4_3_social_test.csv")
social_4_0 <- read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_4_0_pilot1_soc_test.csv")

nonsocial_4_3 <- read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_pilot2_4_3_nosocial_test.csv")
nonsocial_4_0 <- read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_4_0_pilot1_nosoc_test.csv")

# merge social and nonsocial
social <- rbind.fill(social_4_0,social_4_3)
social$condition <- c("Social") # add condition column to social 

nonsocial <- rbind.fill(nonsocial_4_0,nonsocial_4_3)
nonsocial$condition <- c("No Social") # add condition column to social 

# bind these to d
d <- rbind.fill(social, nonsocial)
d$condition <- factor(d$condition)

## RT cleanup
qplot(rt,data=d)
qplot(log(rt),fill=condition,data=d)

# remove +/- 2SD
d$rt[log(d$rt) > mean(log(d$rt)) + 2* sd(log(d$rt)) | 
       log(d$rt) < mean(log(d$rt)) - 2* sd(log(d$rt))] <- NA

# plot
qplot(rt,data=d,facets=.~condition)
qplot(log(rt), data=d)

## -------------- BASIC ACCURACY ANALYSIS -------------- 
mss <- aggregate(correct ~ trialType + condition + subid + interval, data=d, FUN=mean)
ms <- aggregate(correct ~ trialType + condition + interval, data=mss, FUN=mean)
ms$corr.cih <- aggregate(correct ~ trialType + condition + interval, data=mss, FUN=ci.high)$correct
ms$corr.cil <- aggregate(correct ~ trialType + condition + interval, data=mss, FUN=ci.low)$correct

# add reaction times
mss.rt <- aggregate(rt ~ trialType + condition + subid + interval, data=d, FUN=mean)
ms$rt <- aggregate(rt ~ trialType + condition, data=mss.rt, FUN=mean)$rt
ms$rt.cih <- aggregate(rt ~ trialType + condition, data=mss.rt, FUN=ci.high)$rt
ms$rt.cil <- aggregate(rt ~ trialType + condition, data=mss.rt, FUN=ci.low)$rt

## graph accuracy with three factors: condition, delay, and trialType
qplot(x=trialType,y=correct,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=condition,group=condition, size = I(1),
      geom=c("line","pointrange"),
      position=position_dodge(width=.02),
      data=ms) + 
  ylim(.2,1) +
  xlab("Trial Type") +
  ylab("Propotion Correct") +
  theme_bw(base_size = 14)  +
  facet_grid(. ~ interval)

## use LMER to test
m1 <- glmer(correct ~ trialType * condition * interval + (trialType | subid), 
           data=d, family=binomial)


## -------------- BY TRIAL ANALYSIS  -------------- 
d <- ddply(d, .(subid), function(x) {
#   stopifnot(length(x$trial.num)==8)
  x$trial.num.rev <- (1:8)[1:length(x$trial.num)] # still ugly
  return(x)
})

mss.tn <- aggregate(correct ~ trialType + condition + subid + interval + trial.num.rev, data=d, FUN=mean)
ms.tn <- aggregate(correct ~ trialType + condition + interval + trial.num.rev, data=mss.tn, FUN=mean)
ms.tn$corr.cih <- aggregate(correct ~ trialType + condition + interval + trial.num.rev, data=mss.tn, FUN=ci.high)$correct
ms.tn$corr.cil <- aggregate(correct ~ trialType + condition + interval + trial.num.rev, data=mss.tn, FUN=ci.low)$correct

## graph accuracy with three factors: condition, delay, and trialType
qplot(x=trial.num.rev,y=correct,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=condition,group=condition, size = I(1),
      geom=c("pointrange"),
      position=position_dodge(width=.1),
      data=ms.tn) + 
  geom_smooth(se=FALSE,method="lm",span=1) + 
  ylim(0,1) +
  xlab("Trial Type") +
  ylab("Propotion Correct") + 
  facet_grid(trialType ~ interval) + 
  theme_bw()

## use LMER to test
m1 <- glmer(correct ~ trialType * condition * interval + (trialType | subid), 
            data=d, family=binomial)


## -------------- RT ANALYSIS -------------- 

social.same.rt <- subset(mss.rt, mss.rt$trialType == "Same" & mss.rt$condition == "Social")
social.switch.rt <- subset(mss.rt, mss.rt$trialType == "Switch" & mss.rt$condition == "Social")

nonsocial.same.rt <- subset(mss.rt, mss.rt$trialType == "Same" & mss.rt$condition == "NoSocial")
nonsocial.switch.rt <- subset(mss.rt, mss.rt$trialType == "Switch" & mss.rt$condition == "NoSocial")

t.test(social.same.rt$rt, nonsocial.same.rt$rt)
t.test(social.switch.rt$rt, nonsocial.switch.rt$rt)


## now plot accuracy with 95% ci
qplot(x=trialType,y=correct,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=condition,group=condition, size = I(1),
      geom=c("line","pointrange"),
      position=position_dodge(width=.02),
      data=ms) + 
  ylim(.2,1) +
  xlab("Trial Type") +
  ylab("Propotion Correct") +
  theme_bw(base_size = 14) 

ggsave(file="4_3_accuarcy.png", path="/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/plots", height=3, width=5)

## now plot reaction time with 95% ci
qplot(x=trialType,y=rt,
      ymin=rt-rt.cil, ymax=rt+rt.cih,
      colour=condition,group=condition, size = I(1),
      geom=c("line","pointrange"),
      position=position_dodge(width=.02),
      data=ms) + 
  xlab("Trial Type") +
  ylab("Reaction Time") +
  theme_bw(base_size = 14) 

ggsave(file="rt.png", path="/Users/kylemacdonaldadmin/Documents/Projects/JA_XSIT/probmods", height=3, width=5)


## -------------- RELATIONSHIP BETWEEN RT AND ACCURACY -------------- 

# create table with mean accuracy and mean reaction time for each subjects
mss.all <- merge(mss, mss.rt, by="subid")
str(mss.all)

mss.all$correct <- as.factor(mss.all$correct)

aggregate(rt ~ correct + subid, data=d, FUN=mean)

# now plot relationship between rt and acc
qplot(correct, rt, data=d, geom="boxplot", 
      main="RT and Accuracy", xlab="Correct", 
      ylab="RT (ms)")


## -------------- EXPOSURE TRIALS ANALYSIS  -------------- 

social.exposure_4_0_noarrows <- read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_4_0_pilot1_soc_exposure.csv")
social.exposure_4_0_arrows <-read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_4_0_pilot2_soc_exposure.csv")
social.exposure_4_3_arrows <-  read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_pilot2_4_3_social_exposure.csv")
nonsocial.exposure <- read.csv("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/data/ja_xsit_4_0_pilot1_nosoc_exposure.csv")

## Remove extra columns in social data sets so we can merge 
social.exposure_4_0_arrows$faceIdx <- NULL
social.exposure_4_0_arrows$choseSocial <- NULL

social.exposure_4_3_arrows$faceIdx <- NULL
social.exposure_4_3_arrows$choseSocial <- NULL

## Add condition columns before binding 

social.exposure_4_0_noarrows$condition <- "Social 4_0 No Arrows"
social.exposure_4_0_arrows$condition <- "Social 4_0 Arrows"
social.exposure_4_3_arrows$condition <- "Social 4_3 Arrows"
nonsocial.exposure$condition <- "No Social"

## bind together
ed <- rbind(social.exposure_4_0_arrows, social.exposure_4_0_noarrows, social.exposure_4_3_arrows, nonsocial.exposure)

## add trial type and factor condition column
ed$condition <- factor(ed$condition)
ed$trialType <- "Exposure"

str(ed)

## maps face levels to indices to get the proportion of participants who chose the target of gaze
ed$faceIdx <- revalue(ed$face, c("eyesleftarrow"=0, "eyesleft"=0, "eyesdownleftarrow"=1, "eyesdownleft"=1, "eyesdownrightarrow"=2, "eyesdownright"=2, "eyesrightarrow"=3, "eyesright"=3, "eyescenter2"=-1, "eyescenter"=-1))
ed$choseSocial <- ed$faceIdx == ed$chosenIdx
ed$choseSocial[ed$faceIdx==-1] <- NA
mean(ed$choseSocial,na.rm=TRUE)

## get mean chose social by trial type, condition, and sub id
mss.exp <- aggregate(choseSocial ~ trialType + subid + condition, data=ed, FUN=mean)
ms.exp <- aggregate(choseSocial ~ trialType + condition, data=ed, FUN=mean)
ms.exp$choseSocial.cih <- aggregate(choseSocial ~ trialType + condition, data=mss.exp, FUN=ci.high)$choseSocial
ms.exp$choseSocial.cil <- aggregate(choseSocial ~ trialType + condition, data=mss.exp, FUN=ci.low)$choseSocial


# same thing but with left or right midline as correct
ed$faceIdxEasy <- revalue(ed$face, c("eyesleftarrow"=0, "eyesleft"=0, "eyesdownleftarrow"=0, "eyesdownleft"=0, "eyesdownrightarrow"=1, "eyesdownright"=1, "eyesrightarrow"=1, "eyesright"=1, "eyescenter2"=-1))
ed$chosenIdxEasy <- floor(ed$chosenIdx/2)
ed$choseSocialEasy <- ed$faceIdxEasy == ed$chosenIdxEasy
ed$choseSocialEasy[ed$faceIdxEasy==-1] <- NA
mean(ed$choseSocialEasy, na.rm=TRUE)

# get mean by trial type, condition, and sub id
mss.exp.easy <- aggregate(choseSocialEasy ~ trialType + subid + condition, data=ed, FUN=mean)
ms.exp.easy <- aggregate(choseSocialEasy ~ trialType + condition, data=ed, FUN=mean)
ms.exp.easy$choseSocialEasy.cih <- aggregate(choseSocialEasy ~ trialType + condition, data=mss.exp.easy, FUN=ci.high)$choseSocialEasy
ms.exp.easy$choseSocialEasy.cil <- aggregate(choseSocialEasy ~ trialType + condition, data=mss.exp.easy, FUN=ci.low)$choseSocialEasy

# plot accuracy on exposure trials
str(ms.exp)
ms.exp$condition <- as.factor(ms.exp$condition)
# reorder factor levels for graphing
ms.exp$condition <- factor(ms.exp$condition, levels=c("No Social", "Social 4_0 No Arrows", "Social 4_0 Arrows", "Social 4_3 Arrows"))


qplot(data=ms.exp, x=condition, y=choseSocial, 
      ymin=choseSocial-choseSocial.cil, ymax=choseSocial+choseSocial.cih, 
      group=1) +
      ylab("Propotion Chose Target of Eye-Gaze/Arrows") +
      xlab("Condition") +
      geom_pointrange(colour="cyan3") +
      geom_line(colour="cyan3", size=1) + 
      ylim(0,1) + 
      theme_bw(base_size=16) +
      theme(axis.title.x=element_text(vjust=-0.5)) +
      theme(axis.title.y=element_text(vjust=0.3)) 

ggsave(file="choseSocial_1v2_pilot2_4_0.pdf", path="/Users/kylemacdonaldadmin/Documents/Projects/JA_XSIT/data/plots/")

## -------------- RT on Exposure Trials  -------------- 

mss.exp.rt <- aggregate(rt ~ trialType + condition + subid + interval, data=ed, FUN=mean)
ms.exp.rt <- aggregate(rt ~ trialType + condition, data=mss.exp.rt, FUN=mean)
ms.exp.rt$rt.cih <- aggregate(rt ~ trialType + condition, data=mss.exp.rt, FUN=ci.high)$rt
ms.exp.rt$rt.cil <- aggregate(rt ~ trialType + condition, data=mss.exp.rt, FUN=ci.low)$rt

## RT cleanup
qplot(rt,data=mss.exp.rt)
qplot(log(rt),fill=condition,data=mss.exp.rt)

# remove +/- 2SD
mss.exp.rt$rt[log(mss.exp.rt$rt) > mean(log(mss.exp.rt$rt)) + 2* sd(log(mss.exp.rt$rt)) | 
       log(mss.exp.rt$rt) < mean(log(mss.exp.rt$rt)) - 2* sd(log(mss.exp.rt$rt))] <- NA

# plot
qplot(rt,data=mss.exp.rt,facets=.~condition)
qplot(log(rt), data=mss.exp.rt)

## plots mean reaction time for the four different exposure conditions 

# reorder factor levels for graphing
ms.exp.rt$condition <- factor(ms.exp.rt$condition, levels=c("No Social", "Social 4_0 No Arrows", "Social 4_0 Arrows", "Social 4_3 Arrows"))

qplot(data=ms.exp.rt, x=condition, y=rt, 
      ymin=rt-rt.cil, ymax=rt+rt.cih, 
      group=1) +
  ylab("Mean Reaction Time") +
  xlab("Condition") +
  geom_pointrange(colour="cyan3") +
  geom_line(colour="cyan3", size=1) + 
  theme_bw(base_size=12) +
  ylim(0, 4000) +
  theme(axis.title.x=element_text(vjust=-0.5)) +
  theme(axis.title.y=element_text(vjust=0.3)) 

## -------------- STATS  -------------- 

## calculate the probability of getting 0, 1, 2, 3, or 4 correct given a 0.25 chance of success on each trial number correct
nulls <- dbinom(c(0,1,2,3,4),4,1/4)

## get the total number correct by trial type and condition 
sss <- aggregate(correct ~ trialType + condition + subid, data=d,FUN=sum)

## subset data into social and nonsocial for chisquare tests
social.sss <- subset(sss, sss$condition == "Social")
nonsocial.sss <- subset(sss, sss$condition =="NoSocial")

## For social, aggregate correct by trial type
social.ssm <- aggregate(correct ~ trialType, data=social.sss, FUN=sum)

social.ss <- aggregate(correct ~ trialType,data=social.sss, FUN = function(x) {hist(x,breaks=c(-1,0,1,2,3,4),plot=FALSE)$counts})

## get the total number of subjects by trial type and condition 
social.ss$n <- aggregate(subid ~ trialType, data=social.sss,FUN=function(x) {length(unique(x))})$subid

## get chisquare and p values
for(i in 1:nrow(social.ss)){
  chisq <- chisq.test(social.ss[i,2],p=nulls,simulate.p=FALSE)
  social.ss$chisq2[i] <- chisq$statistic
  social.ss$pval2[i] <- chisq$p.value
  social.ss$df[i] <- chisq$parameter
  
}

## Now do the same for nonsocial ##

nonsocial.ssm <- aggregate(correct ~ trialType,
                        data=nonsocial.sss,FUN=sum)

nonsocial.ss <- aggregate(correct ~ trialType,data=nonsocial.sss,
                       FUN = function(x) {hist(x,breaks=c(-1,0,1,2,3,4),plot=FALSE)$counts})


## next we get the total number of subjects by trial type and condition 

nonsocial.ss$n <- aggregate(subid ~ trialType,
                         data=nonsocial.sss,FUN=function(x) {length(unique(x))})$subid

## get chisquare and p values
for(i in 1:nrow(nonsocial.ss)){
  chisq <- chisq.test(nonsocial.ss[i,2],p=nulls,simulate.p=FALSE)
  nonsocial.ss$chisq2[i] <- chisq$statistic
  nonsocial.ss$pval2[i] <- chisq$p.value
  nonsocial.ss$df[i] <- chisq$parameter
  
}


## comparing exposure performance to performance expected by chance using binomial test with probability of success 1/4
x <-sum(ed$choseSocial,na.rm=T)
n <- 236
  
binom.test(x, n, p=0.25, alternative="t")

