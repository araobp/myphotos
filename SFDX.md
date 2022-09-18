
```
Login
sfdx auth:web:login --setdefaultdevhubusername --setalias DevHub

Create Scratch Org
sfdx force:org:create --setdefaultusername --definitionfile config/project-scratch-def.json

Delete Scratch Org
sfdx force:org:delete -u <scratch org name>

```
