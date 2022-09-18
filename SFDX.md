
```
Login
sfdx auth:web:login --setdefaultdevhubusername --setalias DevHub

Create Scratch Org
sfdx force:org:create --setdefaultusername --definitionfile config/project-scratch-def.json

Show Org list
sfdx force:org:list

Push source to Org
sfdx force:source:push

Delete Scratch Org
sfdx force:org:delete -u <scratch org name>
```
