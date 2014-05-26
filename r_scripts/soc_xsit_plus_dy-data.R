rm(list=ls())
library(bootstrap)
library(lme4)
library(ggplot2)
library(arm)
library(directlabels)
library(stringr)
library(plyr)
library(reshape2)
library(car)
options(device="quartz")

## code for bootstrapping 95% confidence intervals 
theta <- function(x,xdata,na.rm=T) {mean(xdata[x],na.rm=na.rm)}
ci.low <- function(x,na.rm=T) {
  mean(x,na.rm=na.rm) - quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.025,na.rm=na.rm)}
ci.high <- function(x,na.rm=T) {
  quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.975,na.rm=na.rm) - mean(x,na.rm=na.rm)}

## helper functions
inv.logit <- function(x) {1 / (1 + exp(-x))} # for checking coefficients in glm

## maps levels of variable to 
mf_labeller <- function(var, value){
  value <- as.character(value)
  if (var=="numPicN") { 
    value[value=="2"] <- "2-Referents"
    value[value=="4"] <- "4-Referents"
    value[value=="6"] <- "6-Referents"
    value[value=="8"] <- "8-Referents"
  }
  return(value)
}

## -------------- READ IN DATA --------------

d <- read.csv("/Users/kmacdonald/Documents/Projects/SOC_XSIT/processed_data/soc_xsit_expt1_master.csv")
ms <- read.csv("/Users/kmacdonald/Documents/Projects/SOC_XSIT/processed_data/replicate_processing/aggregate_soc_xsit.csv")

## get number of subjects in each condition 
numSubs <- aggregate(correct ~ subid + condition + intervalNum + numPicN, data=d, FUN=mean)
numSubs.summary <- count(numSubs, vars=c("condition", "intervalNum", "numPicN"))

## check for duplicates 
unique(numSubs$subid[duplicated(numSubs$subid)])

## -------------- GET SUBSETS FOR ANALYSIS --------------

## get the test trials only
d.test <- subset(d, testTrial==1) 

## get first trials only
d.first.trial <- subset(d, testTrial==1 & first.trial==TRUE)

## grab exposure trials only
d.exp <- subset(d, exposureTrial==1)

d.exp$faceIdx6 <- revalue(d.exp$face, c("eyes_left_90"=0, "eyes_right_90"=1, 
                                        "eyes_left"=2, "eyes_down_left"=3,
                                        "eyes_down_right"=4, "eyes_right"=5, 
                                        "eyescenter"=-1))

# flag if subject chose target of eye gaze
# exposure trials left/right midline and on the bottom row
d.exp$choseSocial <- NA 
d.exp$imgLocation <- NA

d.exp$imgLocation <- ifelse((d.exp$face == "eyes_right_90") | 
                              (d.exp$face == "eyes_left_90") |
                              (d.exp$face == "eyes_center" & d.exp$chosenIdx <= 1), 
                              "midline",
                            ifelse((d.exp$face == "eyes_up_left") |
                                (d.exp$face == "eyes_up_mid_left") |
                                (d.exp$face == "eyes_up_mid_right") |
                                (d.exp$face == "eyes_up_right") |
                                (d.exp$face == "eyes_center" & d.exp$chosenIdx <= 3),
                                "top",
                              "bottom"))

d.exp$choseSocial <- ifelse((d.exp$numPic == 6) & (d.exp$condition =="Social"), 
                            d.exp$faceIdx6 == d.exp$chosenIdx, 
                            d.exp$faceIdx == d.exp$chosenIdx) 

## -------------- BASIC ACCURACY ANALYSIS -------------- 

## aggregate 
mss <- aggregate(correct ~ trialType + condition + subid + intervalNum + numPicN, data=d.test, FUN=mean)
ms <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss, FUN=mean)
ms$corr.cih <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss, FUN=ci.high)$correct
ms$corr.cil <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss, FUN=ci.low)$correct

# add reaction times
mss.rt <- aggregate(rt ~ trialType + condition + subid + intervalNum + numPicN, data=d.test, FUN=mean)
ms$rt <- aggregate(rt ~ trialType + condition + intervalNum + numPicN, data=mss.rt, FUN=mean)$rt
ms$rt.cih <- aggregate(rt ~ trialType + condition + intervalNum + numPicN, data=mss.rt, FUN=ci.high)$rt
ms$rt.cil <- aggregate(rt ~ trialType + condition + intervalNum + numPicN, data=mss.rt, FUN=ci.low)$rt

## graph accuracy with three factors: condition, delay, and trialType
quartz(width=10,height=6,title = "Experiment 2 Accuracy: Unfiltered")
qplot(x=intervalNum,y=correct, linetype=trialType,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=condition, 
      geom=c("line", "pointrange"),
      position=position_dodge(width=.02),
      data=ms) +
  facet_grid(. ~ numPicN, labeller=mf_labeller) + 
  scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1),
                     name = "Prop. Choosing Repeated Referent") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7),
                     name = "Intervening Trials") +
  geom_hline(aes(yintercept=1/numPicN),lty=2) + 
  theme_bw()

## -------------- FIRST TRIAL ANALYSIS -------------- 

## aggregate 
mss.first <- aggregate(correct ~ trialType + condition + subid + intervalNum + numPicN, data=d.first.trial, FUN=mean)
ms.first <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss.first, FUN=mean)
ms.first$corr.cih <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss.first, FUN=ci.high)$correct
ms.first$corr.cil <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss.first, FUN=ci.low)$correct

# add reaction times
mss.rt.first <- aggregate(rt ~ trialType + condition + subid + intervalNum + numPicN, data=d.first.trial, FUN=mean)
ms.first$rt <- aggregate(rt ~ trialType + condition + intervalNum + numPicN, data=mss.rt.first, FUN=mean)$rt
ms.first$rt.cih <- aggregate(rt ~ trialType + condition + intervalNum + numPicN, data=mss.rt.first, FUN=ci.high)$rt
ms.first$rt.cil <- aggregate(rt ~ trialType + condition + intervalNum + numPicN, data=mss.rt.first, FUN=ci.low)$rt

## graph accuracy with three factors: condition, delay, and trialType

quartz(width=10,height=6,title = "Experiment 2 First Trial Data")
qplot(x=intervalNum,y=correct, linetype=trialType,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=condition, 
      geom=c("line", "pointrange"),
      position=position_dodge(width=.02),
      data=ms.first) +
  facet_grid(. ~ numPicN, labeller=mf_labeller) + 
  scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1),
                     name = "Prop. Choosing Repeated Referent") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7),
                     name = "Intervening Trials") +
  geom_hline(aes(yintercept=1/numPicN),lty=2) + 
  theme_bw()  
  

## -------------- ACC ON EXPOSURE TRIALS ANALYSIS  -------------- 

## get mean chose social by trial type, condition, and sub id
mss.exp <- aggregate(choseSocial ~ trialType + subid + condition + numPicN, data=d.exp, FUN=mean)
ms.exp <- aggregate(choseSocial ~  condition + numPicN, data=d.exp, FUN=mean)
ms.exp$choseSocial.cih <- aggregate(choseSocial ~ condition + numPicN, data=mss.exp, FUN=ci.high)$choseSocial
ms.exp$choseSocial.cil <- aggregate(choseSocial ~ condition + numPicN, data=mss.exp, FUN=ci.low)$choseSocial

# now plot with NumPicF as a factor
ms.exp$numPicF <- as.factor(ms.exp$numPicN)

quartz(width=3,height=4,title = "Experiment 2: Exposure Trials")
acc_exp <- ggplot(data=ms.exp, aes(x=numPicF, y=choseSocial))
                geom_bar(stat="identity", fill="dodgerblue") +
                geom_errorbar(aes(ymin=choseSocial-choseSocial.cil, ymax=choseSocial+choseSocial.cih),
                              width=.2) +
                ylim(0,1) +
                xlab("Number of Referents") +
                ylab("Proportion Chose Target of Gaze") +
                theme_bw() 
  
ggsave(acc_exp, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="acc_exposure.png", width=3, height=3)

## -------------- ACCURACY TEST TRIALS [TARGET OF EYE GAZE ON EXPOSURE ANALYSIS]  -------------- 

## subset exposure trials, extracting only the relevant columns
d.choseSocial <- subset(d.exp, select=c("subid", "itemNum", "choseSocial", "rt"))

## now merge with test trials by subid and itemNum (itemNum links exposure to test trials)
d.gaze.tar.all <- merge(d.test, d.choseSocial, by=c("subid", "itemNum"), all=TRUE)
length(unique(d.gaze.tar.all$subid)) # check that all subs are still there

# now get the just the trials on which participants selected the target of eye gaze and the no social condition
d.gaze.tar <- subset(d.gaze.tar.all, choseSocial == TRUE | condition == "No-Social", select=c(subid:rt.y))

# sanity checks and descriptives 
length(unique(d.gaze.tar$subid))
numSubs.exp <- aggregate(correct ~ subid + condition + intervalNum + numPicN, data=d.gaze.tar, FUN=mean)
numSubs.exp.summary <- count(numSubs.exp, vars=c("condition", "intervalNum", "numPicN"))

count(d.gaze.tar$correct)

## remove trials with RT +/- 2SD on test trials
d.gaze.tar$correct[log(d.gaze.tar$rt.x) > mean(log(d.gaze.tar$rt.x)) + 2* sd(log(d.gaze.tar$rt.x)) | 
                log(d.gaze.tar$rt.x) < mean(log(d.gaze.tar$rt.x)) - 2* sd(log(d.gaze.tar$rt.x))] <- NA

## remove trials with RT +/- 2SD on exposure trials
# first, remove RTs = 0
d.gaze.tar$rt.y[d.gaze.tar$rt.y==0] <- NA

d.gaze.tar$correct[log(d.gaze.tar$rt.y) > mean(log(d.gaze.tar$rt.y), na.rm=T) + 2* sd(log(d.gaze.tar$rt.y), na.rm=T) | 
                     log(d.gaze.tar$rt.y) < mean(log(d.gaze.tar$rt.y), na.rm=T) - 2* sd(log(d.gaze.tar$rt.y), na.rm=T)] <- NA

# get counts of NAs
count(d.gaze.tar$correct)

# now aggregate to get means 
mss.gaze.tar <- aggregate(correct ~ trialType + condition + subid + intervalNum + numPicN, data=d.gaze.tar, FUN=mean, na.action = na.omit)
ms.gaze.tar <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss.gaze.tar, FUN=mean, na.action = na.omit)
ms.gaze.tar$corr.cih <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss.gaze.tar, FUN=ci.high, na.action = na.omit)$correct
ms.gaze.tar$corr.cil <- aggregate(correct ~ trialType + condition + intervalNum + numPicN, data=mss.gaze.tar, FUN=ci.low, na.action = na.omit)$correct

# output for models
write.csv(ms.gaze.tar,"~/Documents/Projects/SOC_XSIT/processed_data/aggregate_soc_xsit.csv",row.names=FALSE)

# now plot 
quartz(width=10,height=6,title = "Experiment 2 Accuracy: Filtered")
acc_plot <- qplot(x=intervalNum,y=correct, linetype=trialType,
                    ymin=correct-corr.cil, ymax=correct+corr.cih,
                    colour=condition, 
                    geom=c("pointrange", "line"),
                    position=position_dodge(width=.02),
                    data=ms.gaze.tar) +
    facet_grid(. ~ numPicN, labeller=mf_labeller) + 
    scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1),
                       name = "Prop. Choosing Repeated Referent") +
    scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7),
                       name = "Intervening Trials") +
    geom_hline(aes(yintercept=1/numPicN),lty=2) + 
    theme_bw() + 
    scale_color_manual(values=c("firebrick1", "dodgerblue"), 
                       name="Experimental\nCondition") +
    scale_linetype_manual("Trial Type",
                          values=c("Switch"=2,"Same"=1)) +
    guides(color = guide_legend(keywidth = 2, keyheight = 1, 
                                reverse=T)) + 
    guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
    theme(legend.position = "top") 
  

ggsave(acc_plot, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
      file="acc_test.png", width=5.5, height=4)

## -------------- ACCURACY on SIDE VS. BOTTOM IMAGES: 6-REFERENT COND -------------- 

# get the relevant info from exposure trials subset 
d.choseDirection <- subset(d.exp, select=c("subid", "itemNum", "face", 
                                           "choseSocial", "imgLocation"))
# now merge with test trials
d.direction <- merge(d.test, d.choseDirection, by=c("subid", "itemNum"), all=TRUE)

# get the 6 referent social condition
d.direction <- subset(d.direction, numPicN==6, select=c(subid:imgLocation))
d.direction <- subset(d.direction, choseSocial == TRUE | condition=="No-Social", select=c(subid:imgLocation))

# sanity checks and descriptives 
length(unique(d.direction$subid))
numSubs.direction <- aggregate(correct ~ subid + condition + intervalNum + numPicN + imgLocation, data=d.direction, FUN=mean)
numSubs.direction.summary <- count(numSubs.direction, vars=c("condition", "intervalNum", "numPicN", "imgLocation"))

# aggregate 
mss.direction <- aggregate(correct ~ trialType + condition + subid + intervalNum + imgLocation, data=d.direction, FUN=mean)
ms.direction <- aggregate(correct ~ trialType + condition + intervalNum + imgLocation, data=mss.direction, FUN=mean)
ms.direction$corr.cih <- aggregate(correct ~ trialType + condition + intervalNum + imgLocation, data=mss.direction, FUN=ci.high)$correct
ms.direction$corr.cil <- aggregate(correct ~ trialType + condition + intervalNum + imgLocation, data=mss.direction, FUN=ci.low)$correct

# now plot with imgLocation as facet
quartz(width=10,height=6,title = "Experiment 2 Accuracy: Image Location Facet")
qplot(x=intervalNum,y=correct, linetype=trialType,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=imgLocation, 
      geom=c("line", "pointrange"),
      position=position_dodge(width=.02),
      data=ms.direction) +
  facet_grid(. ~ condition) + 
  scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1),
                     name = "Prop. Choosing Repeated Referent") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7),
                     name = "Intervening Trials") +
  theme_bw() 
  
# now plot with condition as facet
quartz(width=10,height=6,title = "Experiment 2 Accuracy: Condition Facet")
qplot(x=intervalNum,y=correct, linetype=trialType,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=imgLocation, 
      geom=c("line","pointrange"),
      position=position_dodge(width=.02),
      data=ms.direction) + 
    facet_grid(. ~ condition) + 
    ylim(0,1) +
    xlab("Delay") +
    ylab("Proportion Correct") +
    theme_bw()

## -------------- ACCURACY on TOP VS. BOTTOM IMAGES: 8-REFERENT COND -------------- 

# get the relevant info from exposure trials subset 
d.choseDirection <- subset(d.exp, select=c("subid", "itemNum", "face", 
                                           "choseSocial", "imgLocation"))
# now merge with test trials
d.direction <- merge(d.test, d.choseDirection, by=c("subid", "itemNum"), all=TRUE)

# get the 6 referent social condition
d.direction <- subset(d.direction, numPicN==6, select=c(subid:imgLocation))
d.direction <- subset(d.direction, choseSocial == TRUE | condition=="No-Social", select=c(subid:imgLocation))

# sanity checks and descriptives 
length(unique(d.direction$subid))
numSubs.direction <- aggregate(correct ~ subid + condition + intervalNum + numPicN, data=d.direction, FUN=mean)
numSubs.direction.summary <- count(numSubs.direction, vars=c("condition", "intervalNum", "numPicN"))

# aggregate 
mss.direction <- aggregate(correct ~ trialType + condition + subid + intervalNum + imgLocation, data=d.direction, FUN=mean)
ms.direction <- aggregate(correct ~ trialType + condition + intervalNum + imgLocation, data=mss.direction, FUN=mean)
ms.direction$corr.cih <- aggregate(correct ~ trialType + condition + intervalNum + imgLocation, data=mss.direction, FUN=ci.high)$correct
ms.direction$corr.cil <- aggregate(correct ~ trialType + condition + intervalNum + imgLocation, data=mss.direction, FUN=ci.low)$correct

# now plot with imgLocation as facet
quartz(width=10,height=6,title = "Experiment 2 Accuracy: Image Location Facet")
qplot(x=intervalNum,y=correct, linetype=trialType,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=imgLocation, 
      geom=c("line", "pointrange"),
      position=position_dodge(width=.02),
      data=ms.direction) +
  facet_grid(. ~ condition) + 
  scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1),
                     name = "Prop. Choosing Repeated Referent") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7),
                     name = "Intervening Trials") +
  theme_bw() 

# now plot with condition as facet
quartz(width=10,height=6,title = "Experiment 2 Accuracy: Condition Facet")
qplot(x=intervalNum,y=correct, linetype=trialType,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=imgLocation, 
      geom=c("line","pointrange"),
      position=position_dodge(width=.02),
      data=ms.direction) + 
  facet_grid(. ~ condition) + 
  ylim(0,1) +
  xlab("Delay") +
  ylab("Proportion Correct") +
  theme_bw()


## -------------- LMERs  -------------- 

lm1 <- glm(correct ~ trialType * condition * intervalNum * numPicN,
           data=d.gaze.tar, family=binomial) # just for kicks, don't interpret p vals.
m1 <- glmer(correct ~ trialType * condition * intervalNum * numPicN + (trialType | subid), 
            data=d.gaze.tar, family=binomial, nAGQ=0)

# logs are way way better
m1.l <- glmer(correct ~ trialType * condition * 
                log2(intervalNum + 1) * log2(numPicN) + 
                (trialType | subid), 
            data=d.gaze.tar, family=binomial, nAGQ=0)

# 3 ways are just as good as 4 way
m1.l3 <- glmer(correct ~ (trialType + condition + 
                log2(intervalNum + 1) + log2(numPicN))^3 + 
                (trialType | subid), 
              data=d.gaze.tar, family=binomial, nAGQ=0)

# 2 way is worse than 3 way
m1.l2 <- glmer(correct ~ (trialType + condition + 
                            log2(intervalNum + 1) + log2(numPicN))^2 + 
                 (trialType | subid), 
               data=d.gaze.tar, family=binomial, nAGQ=0)


### plots
lm1 <- glm(correct ~ (trialType + condition + 
             log2(intervalNum+1) + log2(numPicN))^4,
           data=d.gaze.tar, family=binomial) # just for kicks, don't interpret p vals.
ms.gaze.tar$preds <- predict(lm1, newdata=ms.gaze.tar[,c("trialType","condition","intervalNum","numPicN")])

quartz()
  ggplot(aes(x=intervalNum, y = correct, pch=trialType, col=condition),
         data=ms.gaze.tar) + 
    geom_point() + 
    facet_grid(. ~ numPicN) + 
    geom_line(aes(x=intervalNum, y=inv.logit(preds), col=condition, lty=trialType))




### OTHER LMS
m2 <- glmer(correct ~ trialType * condition * intervalNum * factor(numPicN) + (trialType | subid), 
            data=d.gaze.tar, family=binomial, nAGQ=0) 
m2.n <- glmer(correct ~ trialType * condition * intervalNum * numPicN + (trialType | subid), 
            data=d.gaze.tar, family=binomial, nAGQ=0) 
m2.ns <- glmer(correct ~ (trialType + condition + intervalNum + numPicN)^3 + (trialType | subid), 
              data=d.gaze.tar, family=binomial, nAGQ=0) 
m2.ln <- glmer(correct ~ trialType * condition * log2(intervalNum+1) * log2(numPicN) + (trialType | subid), 
               data=d.gaze.tar, family=binomial, nAGQ=0) 

m2.lns <- glmer(correct ~ (trialType + condition + log2(intervalNum+1) + log2(numPicN))^3 + (trialType | subid), 
               data=d.gaze.tar, family=binomial, nAGQ=0) 

m3 <- glmer(correct ~ (trialType + condition + intervalNum + numPicN)^3 + (trialType | subid), 
            data=d.gaze.tar, family=binomial, nAGQ=0) 
m4 <- glmer(correct ~ (trialType + condition + intervalNum + numPicN)^2 + (1 | subid), 
            data=d.gaze.tar, family=binomial, nAGQ=0) 
m5 <- glmer(correct ~ trialType * condition * intervalNum * numPicN + (1 | subid) + (trialType | subid),
                 data=d.gaze.tar, family=binomial, nAGQ=0)

m.4only <- glmer(correct ~ trialType * condition * intervalNum + (1 | subid), 
                 data=subset(d.gaze.tar,numPicN==4), family=binomial, nAGQ=0) 

m.4only.simple <- glmer(correct ~ trialType + condition + intervalNum + (1 | subid), 
                        data=subset(d.gaze.tar,numPicN==4), family=binomial, nAGQ=0) 

m.6only <- glmer(correct ~ trialType * condition * intervalNum + (trialType | subid), 
                 data=subset(d.gaze.tar,numPicN==6), family=binomial, nAGQ=0) 

## -------------- BY TRIAL ANALYSIS  -------------- 
# Goal: Plot mean proportion correct for each trial 1 - 8

d.test <- ddply(d.test, .(subid), function(x) {
#   stopifnot(length(x$trial.num)==8)
  x$trial.num.rev <- (1:8)[1:length(x$trial.num)] # still ugly
  return(x)
})

mss.tn <- aggregate(correct ~ trialType + condition + subid + intervalNum + numPicN + trial.num.rev, data=d.test, FUN=mean)
ms.tn <- aggregate(correct ~ trialType + condition + intervalNum + numPicN + trial.num.rev, data=mss.tn, FUN=mean)
ms.tn$corr.cih <- aggregate(correct ~ trialType + condition + intervalNum + numPicN + trial.num.rev, data=mss.tn, FUN=ci.high)$correct
ms.tn$corr.cil <- aggregate(correct ~ trialType + condition + intervalNum + numPicN + trial.num.rev, data=mss.tn, FUN=ci.low)$correct

## graph accuracy with three factors: condition, delay, and trialType
quartz(width=10,height=6,title = "Experiment 2 By Trial Analysis")
qplot(x=trial.num.rev,y=correct, linetype=trialType,
      ymin=correct-corr.cil, ymax=correct+corr.cih,
      colour=condition, 
      geom=c("line", "pointrange"),
      position=position_dodge(width=.02),
      data=ms.tn) +
  facet_grid(numPicN ~ intervalNum, labeller=mf_labeller) + 
  scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1),
                     name = "Prop. Choosing Repeated Referent") +
  scale_x_continuous(name = "Trial Number") +
  geom_hline(aes(yintercept=1/numPicN),lty=2) + 
  theme_bw()  


## -------------- RT on Test Trials: Plot -------------- 

rt_plot <- qplot(x=intervalNum,y=rt, linetype=trialType,
                  ymin=rt-rt.cil, ymax=rt+rt.cih,
                  colour=condition, 
                  geom=c("line", "pointrange"),
                  position=position_dodge(width=.02),
                  data=ms) +
  theme_bw() +
  facet_grid(. ~ numPicN, labeller=mf_labeller) + 
  ylab("Reaction Time (ms)") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7),
                     name = "Intervening Trials") +
  scale_color_manual(values=c("firebrick1", "dodgerblue"), 
                     name="Experimental\nCondition") +
  scale_linetype_manual("Trial Type",
                        values=c("Switch"=2,"Same"=1)) +
  guides(color = guide_legend(keywidth = 2, keyheight = 1, 
                              reverse=T)) + 
  guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
  theme(legend.position = "top")  

ggsave(rt_plot, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="rt_test.png", width=5.5, height=4)

## -------------- RT EXPOSURE TRIALS ANALYSIS  -------------- 

mss.exp.rt <- aggregate(rt ~  + condition + subid + intervalNum + numPicN, data=d.exp, FUN=mean)

# remove +/- 2SD
mss.exp.rt$rt[log(mss.exp.rt$rt) > mean(log(mss.exp.rt$rt)) + 2* sd(log(mss.exp.rt$rt)) | 
                log(mss.exp.rt$rt) < mean(log(mss.exp.rt$rt)) - 2* sd(log(mss.exp.rt$rt))] <- NA

ms.exp.rt <- aggregate(rt ~  + condition + intervalNum + numPicN, data=mss.exp.rt, FUN=mean)
ms.exp.rt$rt.cih <- aggregate(rt ~  + condition + intervalNum + numPicN, data=mss.exp.rt, FUN=ci.high)$rt
ms.exp.rt$rt.cil <- aggregate(rt ~  + condition + intervalNum + numPicN, data=mss.exp.rt, FUN=ci.low)$rt

## plots mean reaction time for the different exposure conditions 
quartz(width=10,height=6,title = "Experiment 2: RTs on Exposure Trials")
rt_exp <- qplot(x=intervalNum,y=rt,
                 ymin=rt-rt.cil, ymax=rt+rt.cih,
                 colour=condition, 
                 geom=c("line", "pointrange"),
                 position=position_dodge(width=.02),
                 data=ms.exp.rt) +
  theme_bw() +
  facet_grid(. ~ numPicN, labeller=mf_labeller) + 
  ylab("Reaction Time (ms)") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7),
                     name = "Intervening Trials") +
  scale_color_manual(values=c("firebrick1", "dodgerblue"), 
                     name="Experimental\nCondition") +
  guides(color = guide_legend(keywidth = 2, keyheight = 1, 
                              reverse=T)) + 
  guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
  theme(legend.position = "top") 

ggsave(rt_exp, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="rt_exp.png", width=5.5, height=4)


## -------------- BLOCK ANALYSIS - ONLY 3-DELAY CONDITION  -------------- 

d.3delay <- subset(d.gaze.tar, intervalNum==3)
d.3delay$block <- ifelse(d.3delay$itemNum < 4, 1, 2)

mss.3delay <- aggregate(correct ~ trialType + condition + subid + intervalNum + numPicN + block, data=d.3delay, FUN=mean)
ms.3delay <- aggregate(correct ~ trialType + condition + intervalNum + numPicN + block, data=mss.3delay, FUN=mean)
ms.3delay$corr.cih <- aggregate(correct ~ trialType + condition + intervalNum + numPicN + block, data=mss.3delay, FUN=ci.high)$correct
ms.3delay$corr.cil <- aggregate(correct ~ trialType + condition + intervalNum + numPicN + block, data=mss.3delay, FUN=ci.low)$correct

## now plot with block as facet
quartz(width=10,height=6,title = "Accuracy 3 Delay Condition, Block Facet")
acc_block <- qplot(x=numPicN,y=correct, linetype=trialType,
                  ymin=correct-corr.cil, ymax=correct+corr.cih,
                  colour=condition, 
                  geom=c("line", "pointrange"),
                  position=position_dodge(width=.02),
                  data=ms.3delay) +
  facet_grid(. ~ block) + 
  scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1),
                     name = "Prop. Choosing Repeated Referent") +
  scale_x_continuous(name = "Number of Referents") + 
  theme_bw() + 
  scale_color_manual(values=c("firebrick1", "dodgerblue"), 
                     name="Experimental\nCondition") +
  scale_linetype_manual("Trial Type",
                        values=c("Switch"=2,"Same"=1)) +
  guides(color = guide_legend(keywidth = 2, keyheight = 1, 
                              reverse=T)) + 
  guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
  theme(legend.position = "top")


## --------------  ACC AT TEST BASED ON RT ON EXPOSURE  -------------- 
d.acc.rt <- subset(d.gaze.tar.all, choseSocial == TRUE | (condition == "No-Social" & dataset=="km"), select=c(subid:rt.y))

## aggregate 



## -------------- STATS  -------------- 

## Question for Mike: What's the best way to do chi-square tests with lots of conditions in your dataset?

## calculate the probability of getting 0, 1, 2, 3, or 4 correct given 0.25 and 0.17 chance of success on each trial 
nulls.4ref <- dbinom(c(0,1,2,3,4), size=4, prob=1/4)
nulls.6ref <- dbinom(c(0,1,2,3,4), size=4, prob=1/6)
  
## get the total number correct for each subject by trial type, condition, and number of referents
sss <- aggregate(correct ~ trialType + condition + numPicN + intervalNum + subid, data=d.test,FUN=sum)

## subset data for conducting chi-square (do I need to do this for each condition or is there a way to do this with a loop?)
social.sss.4.0 <- subset(sss, sss$condition == "Social" & sss$numPicN == 4 & sss$intervalNum == 0)

## Get values needed for chi-square
# Number correct by each trial type
social.ssm.4.0 <- aggregate(correct ~ trialType, data=social.sss.4.0, FUN=sum)
# Number of subjects
social.ss.4.0 <- aggregate(correct ~ trialType , data=social.sss.4.0, FUN = function(x) {hist(x,breaks=c(-1,0,1,2,3,4),plot=FALSE)$counts})

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
nonsocial.sss <- subset(sss, sss$condition =="NoSocial")
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