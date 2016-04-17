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

write_path <- file.path("/Users", "kmacdonald", "Documents", "Projects", "SOC-XSIT", "SOC_XSIT_GIT", "data/", "raw_not_anonymized/")

setwd("../../../expts/final/e3_soc_xsit_reliability/data/")

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