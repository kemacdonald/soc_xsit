# add subject numbers to beginning of filename
# files are sorted by date run

count=1
dash="-"
expt="soc-xsit"

for file in *.txt; do mv ./"$file" "$expt$dash$count$dash$file"; count=`expr $count + 1`; done