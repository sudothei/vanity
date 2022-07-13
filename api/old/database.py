from pymongo import MongoClient

def get_database():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = f"mongodb://localhost:27017"
    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING)
    # Create the database for our example (we will use the same database throughout the tutorial
    return client['sudothei']
    
dbname = get_database()
Users = dbname['users']

def getUser(username):
    class User():
        def __init__(self, username):
            result = Users.find({"username": username})[0]
            self.username = result['username']
            self.password = result['password']
            self.level = result["level"]
            self.area = result["area"]
            self.inventory = result['inventory']
        def addItem(self, item):
            inventory = self.inventory
            inventory = [ item for item in inventory ]
            inventory.append(item)
            Users.update_one(
                    { "username": self.username },
                    { "$set" : { "inventory" : inventory } },
                    upsert=True
                    )
        def updateArea(self, areaNum):
            Users.update_one(
                    { "username": self.username },
                    {"$set": { "area" : areaNum }},
                    upsert=True
                    )
    return User(username)

