rm(list=ls())
## load model ##
source("/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_r_scripts/soc_xsit_model.R")

## load packages ##
library(bootstrap)
library(lme4)
library(ggplot2)
library(arm)
library(directlabels)
library(stringr)
library(plyr)
library(reshape2)
options(device="quartz")

######## SIMULATION 0 - model proofing ##########

# if gamma = 0, we're at chance
compute.probs2(gamma=0, lambda=1, sigma=.5, numPic=4, int=0)

# lambda doesn't matter for int=0, but matters a lot for large int
compute.probs2(gamma=1, lambda=0, sigma=.5, numPic=4, int=0)
compute.probs2(gamma=1, lambda=1, sigma=.5, numPic=4, int=0)
compute.probs2(gamma=1, lambda=0, sigma=.5, numPic=4, int=10)
compute.probs2(gamma=1, lambda=1, sigma=.5, numPic=4, int=10)

# sigma is going to control the difference between same and switch
compute.probs2(gamma=1, lambda=1, sigma=0, numPic=4, int=0) 
# actually 1/2 for switch - seems counter intuitive but makes sense: 
# 1/3 chance of getting the one you chose + a random chance the rest of the time

compute.probs2(gamma=1, lambda=1, sigma=.5, numPic=4, int=0)
compute.probs2(gamma=1, lambda=1, sigma=1, numPic=4, int=0)

######## SIMULATION 1 - sigma + interval ##########
## Set parameter values
gamma <- 1.609619               # strength of initial encoding
lambda <- 0.1597503             # rate of memory decay 
sigma <- c(0.25, 0.50, 0.75, 1) # amount of intention given to initial hypothesis 
int <- c(0, 1, 3, 7)            # number of intervening words
numPic <- 4                     # number of pics

## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()
for (i in 1:length(int)){
  for (j in 1:length(sigma)) {
    probs <- rbind(probs,data.frame(p = compute.probs(gamma, lambda, sigma[j], numPic, int[i]),
                                    cond = c("same","switch"),
                                    int = int[i],
                                    sigma = sigma[j]))
  }
}

quartz(width=6,height=4,title = "Simulation 1: Sigma + Interval")
ggplot(data=probs, aes(x=int, y=p)) +
    geom_line(aes(colour=cond)) +
    geom_point(aes(colour=cond)) +
    facet_wrap(~sigma, ncol=4) +
    theme_bw()

######## SIMULATION 2 - sigma + interval + gamma ##########

## Set parameter values
gamma <- seq(.5,2.5,.5)     # strength of initial encoding
lambda <- 0.1597503         # rate of memory decay 
sigma <- seq(0.25,1,.25)    # amount of intention given to initial hypothesis 
int <-  c(0, 1, 3, 7)       # number of intervening words
numPic <- 4                 # number of pics

## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()
for (i in 1:length(int)){
  for (s in 1:length(sigma)) {
    for (g in 1:length(gamma)) {
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic, int[i]),
                                      cond = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma=gamma[g]))
    }
  }
}

quartz(width=10,height=8,title = "Simulation 2: Sigma + Interval + Gamma")
qplot(int, p, colour=cond, facets=gamma~sigma,
      geom="line", data=probs) + ylim(c(0,1))


######## SIMULATION 3 - social cues are a boost to gamma ##########

## Set parameter values
gamma <- 1.5         # strength of initial encoding
lambda <- .15                # rate of memory decay 
sigma <- .56                 # amount of intention given to initial hypothesis 
int <-  c(0, 1, 3, 7)       # number of intervening words
numPic <- 4                 # number of pics
social_boost = .25         # boost to strength of initial encoding

## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()
for (i in 1:length(int)){
  for (s in 1:length(sigma)) {
    for (g in 1:length(gamma)) {
      for (l in 1:length(lambda)) {
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda[l], sigma[s], numPic, int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma[g],
                                      lambda = lambda[l],
                                      cond ="no-social"))
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g] + social_boost, lambda[l], sigma[s], numPic, int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma[g],
                                      lambda = lambda[l],
                                      cond = "social"))
      }
    }
  }
}

quartz()
qplot(int, p, colour=cond, lty=trial.type,
      geom=c("line","point"), data=probs) + ylim(c(0,1)) + theme_bw()

######## SIMULATION 4 - social cues are a boost to sigma ##########

## Set parameter values
gamma <- 1.5               # strength of initial encoding
lambda <- .15               # rate of memory decay 
sigma <- .57             # amount of intention given to initial hypothesis 
int <-  c(0, 1, 3, 7)      # number of intervening words
numPic <- 4                # number of pics
social_boost = .25          # boost to intention - target of eye gaze

## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()
for (i in 1:length(int)){
  for (s in 1:length(sigma)) {
    for (g in 1:length(gamma)) {
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic, int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma[g],
                                      cond ="no-social"))
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s] + social_boost, numPic, int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma[g],
                                      cond = "social"))
    }
  }
}

quartz()
qplot(int, p, colour=cond, lty=trial.type, facets=gamma~sigma,
      geom="line", data=probs) + ylim(c(0,1)) + theme_bw()


######## SIMULATION 5 - manipulate lambda + social boost ##########

## Set parameter values
gamma <- 1.6                  # strength of initial encoding
lambda <- seq(0.05,0.2,.05)   # rate of memory decay 
sigma <- 0.56                 # amount of intention given to initial hypothesis 
int <-  c(0, 1, 3, 7)         # number of intervening words
numPic <- 4                   # number of pics
social_boost = -.1            # boost to memory - less decay

## generate probabilites for different parameter values 
probs <- data.frame()
for (i in 1:length(int)){
  for (s in 1:length(sigma)) {
    for (g in 1:length(gamma)) {
      for (l in 1:length(lambda)) {
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda[l], sigma[s], numPic, int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma[g],
                                      lambda = lambda[l],
                                      cond ="no-social"))
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda[l] + social_boost, sigma[s], numPic, int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma[g],
                                      lambda = lambda[l],
                                      cond = "social"))
      }
    }
  }
}

## now plot
quartz()
qplot(int, p, colour=cond, lty=trial.type, facets=sigma~lambda,
      geom=c("line", "point"), data=probs) + ylim(c(0,1)) + theme_bw()

######## SIMULATION 6 - sigma + interval + numPic ##########
## Set parameter values
gamma <- 1.5                    # strength of initial encoding
lambda <- 0.1597503             # rate of memory decay 
sigma <- c(0.25, 0.50, 0.75, 1) # amount of belief given to initial hypothesis 
int <- c(0, 1, 3, 7)            # number of intervening words
numPic <- c(2, 4, 6)            # number of pics
social_boost = .4               # boost to belief - target of eye gaze


## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()
for (i in 1:length(int)){
  for (n in 1:length(numPic)) {
    for (s in 1:length(sigma)) {
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma, lambda, sigma[s], numPic[n], int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma,
                                      lambda = lambda,
                                      numPic = numPic[n],
                                      cond ="no-social"))
      probs <- rbind(probs,data.frame(p = compute.probs2(gamma, lambda, sigma[s]+social_boost, numPic[n], int[i]),
                                      trial.type = c("same","switch"),
                                      int = int[i],
                                      sigma = sigma[s],
                                      gamma = gamma,
                                      lambda = lambda,
                                      numPic = numPic[n],
                                      cond = "social"))
    }
  }
}

quartz(width=10,height=6,title = "Simulation 6: Sigma + Interval + numPic")
qplot(x=int,y=p, linetype=trial.type,
      colour=cond, 
      geom=c("line", "point"),
      position=position_dodge(width=.09),
      data=probs) +
  facet_grid(sigma ~ numPic) + 
  ylim(0,1) +
  xlab("Delay") +
  ylab("Proportion Correct") +
  theme_bw()  


######## SIMULATION 7 - sigma and gamma + interval + numPic ##########
## Set parameter values
gamma <- seq(.5,2,.5)           # strength of initial encoding
lambda <- 0.1597503             # rate of memory decay 
sigma <- seq(0.25,1,0.25)       # amount of belief given to initial hypothesis 
int <- c(0, 1, 3, 7)            # number of intervening words
numPic <- seq(2,8,2)            # number of pics
social_boost = .4               # boost to belief - target of eye gaze


## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()
for (i in 1:length(int)){
  for (n in 1:length(numPic)) {
    for (s in 1:length(sigma)) {
      for (g in 1:length(gamma)) {
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("same","switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond ="no-social"))
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s]+social_boost, numPic[n], int[i]),
                                        trial.type = c("same","switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond = "social"))
      }
    }
  }
}

## now plot, creating separate plots for different values of gamma
quartz(width=6,height=5,title = "Simulation 7: Sigma/Gamma + Interval + numPic")
qplot(x=int,y=p, linetype=trial.type,
      colour=cond, 
      geom=c("line", "point"),
      data=subset(probs, gamma==2)) +
  facet_grid(sigma ~ numPic) + 
  ylim(0,1) +
  xlab("Delay") +
  ylab("Proportion Correct") +
  theme_bw()  

######## SIMULATION 8 - sigma and gamma (social boost to gamma) + interval + numPic ##########
## Set parameter values
gamma <- seq(.5,2,.5)           # strength of initial encoding
lambda <- 0.1597503             # rate of memory decay 
sigma <- seq(0.25,1,0.25)       # amount of belief given to initial hypothesis 
int <- c(0,1,3,7)               # number of intervening words
numPic <- seq(2,8,2)            # number of pics
social_boost = .2               # boost to strength of encoding - target of eye gaze


## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()

for (i in 1:length(int)){
  for (n in 1:length(numPic)) {
    for (s in 1:length(sigma)) {
      for (g in 1:length(gamma)) {
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("same","switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond ="no-social"))
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g]+social_boost, lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("same","switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond = "social"))
      }
    }
  }
}


qplot(x=int,y=p, linetype=trial.type,
      colour=cond, 
      geom=c("line", "point"),
      data=subset(probs, gamma==1)) +
  facet_grid(sigma ~ numPic) + 
  ylim(0,1) +
  xlab("Delay") +
  ylab("Proportion Correct") +
  theme_bw()  

######## SIMULATION 9 - STAT ACCUMULATOR ##########
## Set parameter values
gamma <- 1.5                    # strength of initial encoding
lambda <- 0                     # rate of memory decay 
sigma <- 1/4                    # amount of belief given to initial hypothesis 
int <- c(0,1,3,7)               # number of intervening words
numPic <- 4                     # number of pics


## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()

for (i in 1:length(int)){
  for (n in 1:length(numPic)) {
    for (s in 1:length(sigma)) {
      for (g in 1:length(gamma)) {
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond ="No-social"))
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond = "Social"))
      }
    }
  }
}


stat_accumulator <- ggplot(data=subset(probs,gamma=1.5), 
                          aes(x=int, y=p, colour=cond, linetype=trial.type)) +
                geom_point(position=position_jitter(w=0, h=0.01)) +
                geom_line(position=position_jitter(w=0, h=0.01)) +
                scale_y_continuous(limits = c(0,1),breaks=c(0,.25,.5,.75,1), name = "Predicted Prop. Correct") +
                scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7), name = "Intervening Trials") + 
                geom_hline(aes(yintercept=1/4),lty=2) + 
                scale_colour_manual(values=c("firebrick1", "dodgerblue"), name="Experimental\nCondition") +
                scale_linetype_manual("Trial Type", values=c("Switch"=2,"Same"=1)) +
                guides(color = guide_legend(keywidth = 2, keyheight = 1, reverse=T)) + 
                guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
                theme_bw() +
                ggtitle("4-Referent") + 
                theme(legend.position = "right") 
  

ggsave(stat_accumulator, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="stat_accumulator.png", width=2.5, height=3)
 

######## SIMULATION 10 - SINGLE HYPOTHESIS TRACKER ##########
## Set parameter values
gamma <- 1.5                    # strength of initial encoding
lambda <- 0                     # rate of memory decay 
sigma <- 1                      # amount of belief given to initial hypothesis 
int <- c(0,1,3,7)               # number of intervening words
numPic <- 4                     # number of pics


## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()

for (i in 1:length(int)){
  for (n in 1:length(numPic)) {
    for (s in 1:length(sigma)) {
      for (g in 1:length(gamma)) {
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond ="No-social"))
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond = "Social"))
      }
    }
  }
}


single_hyp <- ggplot(data=subset(probs,gamma=1.5), 
                           aes(x=int, y=p, colour=cond, linetype=trial.type)) +
  geom_point(position=position_jitter(w=0, h=0.01)) +
  geom_line(position=position_jitter(w=0, h=0.01)) +
  scale_y_continuous(limits = c(0,1.01),breaks=c(0,.25,.5,.75,1), name = "Predicted Prop. Correct") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7), name = "Intervening Trials") + 
  geom_hline(aes(yintercept=1/4),lty=2) + 
  scale_colour_manual(values=c("firebrick1", "dodgerblue"), name="Experimental\nCondition") +
  scale_linetype_manual("Trial Type", values=c("Switch"=2,"Same"=1)) +
  guides(color = guide_legend(keywidth = 2, keyheight = 1, reverse=T)) + 
  guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
  theme_bw() +
  ggtitle("4-Referent") +
  theme(legend.position = "none")


ggsave(single_hyp, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="single_hyp.png",  width=2.5, height=3)


######## SIMULATION 11 - ADD MEMORY DECAY AND ATTENTION  ##########
## Set parameter values
gamma <- 1.5                    # strength of initial encoding
lambda <- 0.15                  # rate of memory decay 
sigma <- 0.57                   # amount of belief given to initial hypothesis 
int <- c(0,1,3,7)               # number of intervening words
numPic <- 4                     # number of pics


## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()

for (i in 1:length(int)){
  for (n in 1:length(numPic)) {
    for (s in 1:length(sigma)) {
      for (g in 1:length(gamma)) {
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond ="No-social"))
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond = "Social"))
      }
    }
  }
}


mem_att <- ggplot(data=subset(probs,gamma=1.5), 
                     aes(x=int, y=p, colour=cond, linetype=trial.type)) +
                  geom_point(position=position_jitter(w=0, h=0.01)) +
                  geom_line(position=position_jitter(w=0, h=0.01)) +
                  scale_y_continuous(limits = c(0,1.01),breaks=c(0,.25,.5,.75,1), name = "Predicted Prop. Correct") +
                  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7), name = "Intervening Trials") + 
                  geom_hline(aes(yintercept=1/4),lty=2) + 
                  scale_colour_manual(values=c("firebrick1", "dodgerblue"), name="Experimental\nCondition") +
                  scale_linetype_manual("Trial Type", values=c("Switch"=2,"Same"=1)) +
                  guides(color = guide_legend(keywidth = 2, keyheight = 1, reverse=T)) + 
                  guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
                  theme_bw() +
                  ggtitle("4-Referent") + 
                  theme(legend.position = "none") 

ggsave(mem_att, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="add_mem_att.png", width=2.5, height=3)


######## SIMULATION 12 - SOCIAL BOOST TO SIGMA  ##########
## Set parameter values
gamma <- 1                    # strength of initial encoding
lambda <- 0.1597503             # rate of memory decay 
sigma <- c(0.25, 0.50, 0.75, 1) # amount of belief given to initial hypothesis 
int <- c(0, 1, 3, 7)            # number of intervening words
numPic <- c(2, 4, 6, 8)            # number of pics
social_boost = .2               # boost to belief - target of eye gaze

## generate probabilites for different parameter values (sigma, number of pics, delay)
probs <- data.frame()

for (i in 1:length(int)){
  for (n in 1:length(numPic)) {
    for (s in 1:length(sigma)) {
      for (g in 1:length(gamma)) {
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s], numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond ="No-social"))
        probs <- rbind(probs,data.frame(p = compute.probs2(gamma[g], lambda, sigma[s]+social_boost, numPic[n], int[i]),
                                        trial.type = c("Same","Switch"),
                                        int = int[i],
                                        sigma = sigma[s],
                                        gamma = gamma[g],
                                        lambda = lambda,
                                        numPic = numPic[n],
                                        cond = "Social"))
      }
    }
  }
}


sig_soc_boost <- ggplot(data=subset(probs,gamma=1.5), 
                  aes(x=int, y=p, colour=cond, linetype=trial.type)) +
              geom_point() +
              geom_line() +
              scale_y_continuous(limits = c(0,1.01),breaks=c(0,.25,.5,.75,1), name = "Predicted Prop. Correct") +
              scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7), name = "Intervening Trials") + 
              geom_hline(aes(yintercept=1/4),lty=2) + 
              scale_colour_manual(values=c("firebrick1", "dodgerblue"), name="Experimental\nCondition") +
              scale_linetype_manual("Trial Type", values=c("Switch"=2,"Same"=1)) +
              guides(color = guide_legend(keywidth = 2, keyheight = 1, reverse=T)) + 
              guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
              theme_bw() +
              ggtitle("4-Referent") + 
              theme(legend.position = "none") 

ggsave(sig_soc_boost, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="sig_soc_boost.png", width=2.5, height=3)


######## MODEL/DATA FIT PLOTS ##########

## merge with experimental data
d.expt <- read.csv("/Users/kmacdonald/Documents/Projects/SOC_XSIT/processed_data/aggregate_soc_xsit.csv")
names(d.expt) <- c("trial.type","cond","int","numPic","correct","cih","cil","preds")
levels(d.expt$cond) <- c("No-social","Social")
levels(d.expt$trial.type) <- c("Same","Switch")

md <- merge(probs,d.expt,by.x=c("trial.type","cond","int","numPic"),
            by.y=c("trial.type","cond","int","numPic"))

d.summary <- ddply(md, .(gamma,sigma,lambda), 
                   summarise, 
                   r = cor.test(p,correct)$estimate,
                   mse = mean((p - correct)^2))

md.summary <- melt(d.summary, id.vars=c("gamma","sigma","lambda"),
                   measure.vars=c("r","mse"),
                   variable.name="measure",
                   value.name="score")

## plot parameter fits
qplot(gamma, score, colour=factor(sigma), group=factor(sigma), 
      data=md.summary, geom="line") +
  facet_grid(measure~., scales="free_y")


## plot best parameter settings
 mod_data_fit <- ggplot(data=subset(md, sigma==.75 & gamma==1), 
                        aes(x=int, y=correct, colour=cond, linetype=trial.type)) +
  facet_grid(. ~ numPic) +
  geom_pointrange(aes(ymin=correct-cil, ymax=correct+cih)) +
  geom_line(aes(x=int, y=p, colour=cond, linetype=trial.type)) +
  scale_y_continuous(limits = c(0,1.01),breaks=c(0,.25,.5,.75,1), name = "Predicted Prop. Correct") +
  scale_x_continuous(limits=c(-.05,7.1), breaks=c(0, 1, 3, 7), name = "Intervening Trials") + 
  scale_colour_manual(values=c("firebrick1", "dodgerblue"), name="Experimental\nCondition") +
  scale_linetype_manual("Trial Type", values=c("Switch"=2,"Same"=1)) +
  guides(color = guide_legend(keywidth = 2, keyheight = 1, reverse=T)) + 
  guides(linetype = guide_legend(keywidth = 2, keyheight = 1)) +
  theme_bw() +
  ggtitle("Model-Data Fits") + 
  theme(legend.position = "right") 

ggsave(mod_data_fit, path = "/Users/kmacdonald/Documents/Projects/SOC_XSIT/soc_xsit_plots/",
       file="mod_data_fit.png", width=7, height=3.5)
