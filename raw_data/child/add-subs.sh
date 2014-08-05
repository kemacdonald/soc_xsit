# add subject numbers to end of filename
# files are sorted by date run

count=1
dash="-"

for file in *.txt; do 
	mv ./"$file" "$count$dash$file"; 
	count=`expr $count + 1`; 
done


##### remove the subject numbers 

# count=1;

# for file in `ls *.txt | sort -n -t - -k 3`; do 
# 	mv ./"$file" "${file/soc-xsit-$count-/}"; 
# 	count=`expr $count + 1`;
# done