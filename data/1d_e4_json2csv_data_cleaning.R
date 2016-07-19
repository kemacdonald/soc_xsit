##### GET RELEVANT FIELDS FROM JSON OUTPUT #####

##### Experiment 4: Soc-xsit Inspection Time #####

# Clear workspace
rm(list=ls())

## Load libraries 
library(chron)
library(rjson)
library(stringr)
library(jsonlite)
library(plyr)
library(dplyr)
library(lubridate)

## set path for writing data (same for all three experiments)
write_path <- file.path("/Users", "kmacdonald", "Documents", "Projects", "SOC-XSIT", "SOC_XSIT_GIT", "data/", "2_raw_compiled/")

## number of trials in experiment
num_trials_exp <- 36

## set file paths for reading data
setwd("1_raw_not_anonymized/e4_inspection/")

# # Read in all the JSON strings
read.file <- function(filename) {
  con <- file(filename, "r", blocking = TRUE)
  lines <- paste(readLines(con, warn = FALSE), collapse = "\n")
  close(con)
  lines
}

json.filenames <- list.files()
json.strings <- Map(read.file, json.filenames)

##### Convert JSON to a R data frame

# Merge all the json strings together, as if they are in a big array, and convert it to an R data frame:
json.superstring <- paste("[",paste(json.strings, collapse = ","),"]")
assignments <- fromJSON( json.superstring )

# Only keep unique worker IDs.
assignments <- distinct(assignments, WorkerId, .keep_all = T)

##### Build experiment information data frame.
exp_df <- data.frame(
  workerid = assignments$WorkerId, 
  approval_time = assignments$AutoApprovalTime,
  interval = assignments$answers$delay_condition,
  inspection_cond = assignments$answers$inspection_time,
  numPic = assignments$answers$numReferents,
  social_cond = assignments$answers$social_cond,
  broken = assignments$answers$broken,
  about = assignments$answers$about,
  browser = assignments$answers$browser
)


#### Build trial level data frame 

trial.data <- Map(function(id, subject.trial.data) 
{ cbind(workerid = id, subject.trial.data) },
assignments$WorkerId,
assignments$answers$data)

strip.rownames <- function(x) {
  rownames(x) <- NULL
  x
}

trial.data <- strip.rownames(do.call(rbind, trial.data))


##### Merge trial level data with subject/experiment level data

exp_df <- mutate(exp_df, workerid = as.character(workerid))
trial.data <- mutate(trial.data, workerid = as.character(workerid))

df_final <- left_join(exp_df, trial.data, by="workerid")
  

####### Now start munging to create extra variables that we want for analysis reasons

#### This drops the weirdo T and Z from the turk timestamps and then parses them into seconds time 0 (some UTC standard)
df_final$approval_time <- parse_date_time(
  gsub("[[:alpha:]]"," ", 
       df_final$approval_time),
  "Ymd hms"
)

#### add variable to track trial number
trial_numbers <- seq(1:num_trials_exp)

df_final <- ddply(df_final, .(workerid), function(x) {
  x$trial_num <- trial_numbers
  x
  })


#### drop subs who have more than 36 trials
drop.subs <- ddply(df_final,.(workerid), function(x) {nrow(x) > num_trials_exp}) %>% 
  mutate(include = ifelse(V1 == F, "include", "exclude")) %>% 
  select(-V1)

df_final <- left_join(df_final, drop.subs, by = "workerid")

#### clean-up variables

df_final <- df_final %>% 
  mutate(workerid = as.factor(workerid),
         trialType = factor(trialType, labels = c('Same','Switch')),
         intervalNum = ifelse(interval == "Zero", 0, 
                              ifelse(interval == "Three", 3, NA))
         )

#### flag trial category (example, exposure, test)


#### exclude subjects for getting example trials wrong

df_final <- df_final %>% 
  mutate(include = ifelse(trial_num %in% c(1,2) ))



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

##### Anonymize workerids before moving to version control #######

# grab worker ids and create anonymous id number
anonymized_df <- keep.data %>% 
  select(subid) %>% 
  distinct() %>% 
  mutate(subids = 1:nrow(.))

# now join with original data frame
df_final_clean <- left_join(keep.data, anonymized_df, by = "subid") 
df_final_clean <- select(df_final_clean, -subid) %>% 
  rename(subid = subids)

##### SAVE OUTPUT  #####

write.csv(df_final_clean, paste(write_path, "e4_soc_xsit_inspection.csv", sep=""),row.names=FALSE)