#!/bin/bash

i=0
while [ true ] 
do
   curl http://localhost:8080/remote > /dev/null 2>&1
   
   if [[ $(( i % 2)) == 0 ]] 
   then 
     curl http://localhost:8080/hello > /dev/null 2>&1
   fi

   if [[ $(( i % 10)) == 0 ]] 
   then 
   	curl http://localhost:8080/error > /dev/null 2>&1
   fi

   i=$((i+1))
   echo $i
   sleep 1
done 
