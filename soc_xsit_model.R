##### Model Code for soc_xsit #####

compute.probs <- function(gamma, lambda, sigma, numPic, int) {
  sn <- gamma * sigma * (int+1)^-lambda
  on <- gamma * ((1-sigma) / (numPic-1))*(int+1)^-lambda;
  wn <- on/4;
  
  # probability correct on same trials (set ceiling value for p_0 at 1)
  if(sn <= 1) {
    p_s <- mean(rbinom(100000,1,sn + (1-sn)/numPic))
  } else {
    p_s <- mean(rbinom(100000,1,1))
  }
  
  # probability correct on switch trials     
  p_o <- mean(rbinom(100000,1,on + (1-on)/numPic))  
  
  return(c(p_s, p_o))
}

compute.probs2 <- function(gamma=1.5,  # strength of initial encoding
                           lambda=.15, # rate of memory decay 
                           sigma=.5,   # amount of attention given to initial hypothesis 
                           numPic=4,   # number of intervening words
                           int=0)      # number of pics
  {
  
  same_trial_strength <- gamma * sigma * (int+1)^-lambda
  switch_trial_strength <- gamma * ((1-sigma) / (numPic-1))*(int+1)^-lambda
  
  # probability correct on same/switch trials
  # note that if p is > 1, take 1 instead (to keep this expression bound 0,1)
  p_same = min(c(same_trial_strength + (1 - same_trial_strength)/numPic,1))
  p_switch = min(c(switch_trial_strength + (1 - switch_trial_strength)/numPic,1))

  return(c(p_same, p_switch))
}

