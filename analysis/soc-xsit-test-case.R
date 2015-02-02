### Grab within subjects experiment
d.within <- filter(d.all_df, experiment == "soc_vs_no_soc_within")

#### Create test case 
test_case <- filter(d.all_df, experiment == "soc_vs_no_soc_within", condition == "SocialFirst")
test_case_no_soc <- filter(d.all_df, experiment == "soc_vs_no_soc_within", condition == "No-socialFirst")

test_case <- filter(d.all_df, experiment == "within_replication", condition == "SocialFirst")
test_case_no_soc <- filter(d.all_df, experiment == "within_replication", condition == "No-socialFirst")




test_case$faceIdx_new <- revalue(test_case$face,
                                 c("silentLUlong"= 0, "silentLUmedium" = 0,
                                   "silentLUshort"= 0, "LUkidslonger" = 0,
                                   "silentRUlong" = 1, "silentRUmedium"= 1,
                                   "silentRUshort" = 1, "RUkidslonger" = 1,
                                   "silentLDlong" = 2, "silentLDmedium" = 2,
                                   "silentLDshort" = 2, "LDkidslonger" = 2,
                                   "silentRDlong" = 3, "silentRDmedium" = 3,
                                   "silentRDshort" = 3, "RDkidslonger" = 3, 
                                   "straightahead" = -1, "straightaheadlonger" = -1))


test_case_expo <- test_case %>%
            filter(exposure_trial == 1) %>%
            mutate(correct_exposure = faceIdx_new == chosenIdx) %>%
            select(subids, itemNum, correct_exposure)

test_case_test <- test_case %>%
      filter(test_trial == 1)

test_case_test_w.expo <- join(test_case_expo, test_case_test, by = c("subids", "itemNum"))

test_case_test_w.expo1 <- test_case_test_w.expo %>%
                              mutate(condition_trial = ifelse(condition == "No-socialFirst" 
                                                              & itemNum <= 7, "no-social", 
                                                              ifelse(condition == "SocialFirst" 
                                                                     & itemNum <= 7, "social", 
                                                                     ifelse(condition == "No-socialFirst" 
                                                                            & itemNum >= 8, "social",
                                                                            ifelse(condition == "SocialFirst" 
                                                                                   & itemNum >= 8, 
                                                                                   "no-social", NA)))))

test_case_test_w.expo2 <- filter(test_case_test_w.expo1, condition_trial == "social")

test_case_test_w.expo3 <- test_case_test_w.expo2 %>%
                              group_by(subids) %>%
                              summarise(mean_acc_exp = mean(correct_exposure)) %>%
                              mutate(include_expo = ifelse(mean_acc_exp > 0.25,1,0)) 

test_case_test_w.expo4 <- join(test_case_test_w.expo1, test_case_test_w.expo3, by = "subids")


test_case_test_w.expo4 <- test_case_test_w.expo4 %>%
      mutate(include_good_rt = ifelse(log(rt) > mean(log(rt)) + 2 * sd(log(rt)) |
                                            log(rt) < mean(log(rt)) - 2 * sd(log(rt)),
                                      0,1))

test_case_test_w.expo5 <- filter(test_case_test_w.expo4,
                        include_good_rt == 1, 
                        condition_trial == "social")

ms_expo_within <- test_case_test_w.expo5 %>%
      group_by(condition, condition_trial) %>%
      summarise(accuracy_exposure = mean(correct_exposure),
                ci_low = ci.low(correct_exposure),
                ci_high = ci.high(correct_exposure))

inc.data.within_unfilt <- filter(test_case_test_w.expo4, include_good_rt == 1)

ms_test_within_unfilt <- inc.data.within_unfilt %>%
      group_by(condition, condition_trial, trialType) %>%
      summarise(accuracy = mean(correct),
                ci_low = ci.low(correct),
                ci_high = ci.high(correct))




