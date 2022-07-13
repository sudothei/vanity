area0 = {
        "prompt" : """You wake up hung over and strung out.
Techno music is playing loudly.
There is a blindfold over your eyes, you don't know how it got there.
""",
        "onvisit" : lambda : None,
        "commands" : [
                {
                "ismatch" : lambda command: command == "remove blindfold",
                "effects" : None,
                "goto" : 1,
                "image" : None
                }
            ]
        }

area1 = {
        "prompt" : """You are inside what seems to be a warehouse.
Nobody is inside.
Lasers and fog machines are on.
The exit is a pair of steel doors.
You don't appear to be missing any possessions.
""",
        "onvisit" : lambda : None,
        "commands" : [
                {
                "ismatch" : lambda command: command == ("leave" or "exit") + " warehouse",
                "effects" :None,
                "goto" : 2,
                "image" : None
                }
            ]
        }
