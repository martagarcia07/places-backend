# -*- coding: utf-8 -*-
__author__ = 'Meekooloh'
import sys

from pymongo import MongoClient
from bson.objectid import ObjectId


if __name__ == "__main__":
    if len(sys.argv) > 1:
        client = MongoClient('localhost', 27017)
        db= client.places
        #place = db.places.find_one({"_id": sys.argv[1]})
        rates = list(db.rates.find({"pid":sys.argv[1]}))
        if (len( (rates)) > 0):
            total_rate=0.0
            cnt = 0
            for r in  (rates):
                total_rate=total_rate+float(r['rate'])
                cnt+=1
            if cnt>0:
                print total_rate/cnt
            else:
                print 0.0
        else:
            print 0.0

