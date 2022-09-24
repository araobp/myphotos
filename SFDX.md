
```
Login
sfdx auth:web:login --setdefaultdevhubusername --setalias DevHub

Create Scratch Org
sfdx force:org:create --setdefaultusername --definitionfile config/project-scratch-def.json

Show Org list
sfdx force:org:list

Open Scratch Org
sfdx force:org:open -u <scratch org user name>

Then create a user on the scratch org.

Push source to Org
sfdx force:source:push

Assign permission sets
sfdx force:user:permset:assign --permsetname <permset_name> --targetusername <admin-user> --onbehalfof <non-admin-user>

Delete Scratch Org
sfdx force:org:delete -u <scratch org user name>
```
