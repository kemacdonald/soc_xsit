rm(list=ls())

## load model ##
source("/Users/kylemacdonaldadmin/Documents/Projects/SOC_XSIT/soc_xsit_model.R")

library(bootstrap)
library(lme4)
library(ggplot2)
library(arm)
library(directlabels)
library(stringr)
library(plyr)
library(reshape2)

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
int <-  (0, 1, 3, 7)            # number of intervening words
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


qplot(int, p, colour=cond, facets=~sigma,
      geom="line", data=probs) +
      theme_bw()

quartz()

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


qplot(int, p, colour=cond, facets=gamma~sigma,
      geom="line", data=probs) + ylim(c(0,1))


######## SIMULATION 3 - social cues are a boost to gamma ##########

## Set parameter values
gamma <- seq(.5,2,.5)         # strength of initial encoding
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
qplot(int, p, colour=cond, lty=trial.type, facets=sigma~gamma,
      geom=c("line","point"), data=probs) + ylim(c(0,1)) + theme_bw()

######## SIMULATION 4 - social cues are a boost to sigma ##########

## Set parameter values
gamma <- 1.5               # strength of initial encoding
lambda <- .5               # rate of memory decay 
sigma <- c(.25,.5,.75,1)   # amount of intention given to initial hypothesis 
int <-  c(0, 1, 3, 7)      # number of intervening words
numPic <- 4                # number of pics
social_boost = .2          # boost to intention - target of eye gaze

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
lambda <- seq(0.05,0.2,.05)  # rate of memory decay 
sigma <- 0.56                 # amount of intention given to initial hypothesis 
int <-  c(0, 1, 3, 7)         # number of intervening words
numPic <- 4                   # number of pics
social_boost = -.1         # boost to memory - less decay

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

  