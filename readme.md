# CI/CD via Gitlab Pipeline

## Purpose
Enviroment for testing the integration of GitLab's CI/CD Pipeline. It aims to be a starting point on how to implement the tool into a solution and perform a CI/CD development cycle.

---

- [CI/CD via Gitlab Pipeline](#cicd-via-gitlab-pipeline)
  - [Purpose](#purpose)
- [Installation and Configuration](#installation-and-configuration)
  - [GitLab Repo](#gitlab-repo)
  - [Installing the nuget executable](#installing-the-nuget-executable)
  - [Installing MSBuild and VS Web Build](#installing-msbuild-and-vs-web-build)
  - [Installing and registering a Gitlab Runner](#installing-and-registering-a-gitlab-runner)
  - [GitLab Settings](#gitlab-settings)
  - [CI Script](#ci-script)
  - [Publish Profile and Deployment to IIS](#publish-profile-and-deployment-to-iis)
  - [Running jobs](#running-jobs)
- [Pros / Cons](#pros--cons)
- [References](#references)
- [Integrating the Yuniql tool into a CI/CD pipeline](#integrating-the-yuniql-tool-into-a-cicd-pipeline)
  - [Setup](#setup)
  - [How to use](#how-to-use)
  - [Running Yuniql in the pipeline](#running-yuniql-in-the-pipeline)
  - [Console Commands](#console-commands)
  - [GitIgnore](#gitignore)
  - [References](#references-1)

---

# Installation and Configuration

## GitLab Repo
- Create a GitLab repository that will be used to hold the project and the runer

## Installing the nuget executable
Required to restore the nuget packages of the application
- Visit [nuget - Downloads](https://www.nuget.org/downloads) and download the recommended latest version
- In your `C:\` drive create a folder called `Tools` and inside it create a folder called `nuget` 
- Move the downloaded ``exe`` file to the `nuget` folder created before

---

## Installing MSBuild and VS Web Build
Required to build and publish the application.
- Visit [Visual Studio - Downloads](https://visualstudio.microsoft.com/downloads/), click in ``Tools for Visual Studio`` and download the `Build Tools for Visual Studio`
  - **Note:** If you have Visual Studio (not code) in your machine
- Install the downloaded software
- Navigate to: `C:\Program Files (x86)\Microsoft Visual Studio\ *your_version* \MSBuild`
  - Inside this folder search for the `MSBuild.exe` executable as Microsoft changes this folder structure depending on the version of Visual Studio version
  - Open a `cmd` terminal in the folder where the `exe` is located.
- Execute the command: ``vs_buildtools.exe — add Microsoft.VisualStudio.Workload.WebBuildTools``

---

## Installing and registering a Gitlab Runner

- If you don't already have a ``GitLab runner`` installed, please refer to the [official GitLab documentation for Windows](https://docs.gitlab.com/runner/install/windows.html)
- Follow steps 1 to 6 of the installation
  - In step 6 use the commands listed under `Run service using Built-in System Account` 
  - After completing ``step 6``:
    - Navigate to the folder you created to store the runner
    - Edit the file ``config.toml`` 
    - Change the value of the `shell` field from `pwsh` to ``powershell``
    - Save and close the file
    - Open a `cmd` terminal in the same folder and run `gitlab-runner.exe restart`
-If you already have a `GitLab runner` installed go to the runner folder open a `command line` in that location and run:
  - `.\gitlab-runner.exe register`
  - During the configuration, when prompted set the runner as `shell`
  - After completing the configuration:
      - Navigate to the folder you created to store the runner
      - Edit the file ``config.toml`` 
      - Change the value of the `shell` field from `pwsh` to ``powershell``
      - Save and close the file
      - Open a `cmd` terminal in the same folder and run `gitlab-runner.exe restart`
**Note**
  -  During the process of registration you will be asked to select a ``Runner executor``. Here use option ``shell``
 
---

## GitLab Settings

- On GitLab, go to the repository the click on `Settings` > `CI/CD` and expand the `Runners` section
- It should list the created runner as assigned to the project
-  Click on the button with a pencil on the right side of the runner to edit its settings. 
   -  If necessary add the relevant `tags` to your runner. These can/will be used to define what jobs can/cannot be execute and when to execute
   -  If `tags` will not be necessary mark the `Run untagged jobs` which is ``disabled`` by default and will prevent the runner from picking up un-tagged jobs
- Save the changes made to the runner

---

## CI Script

- Refer to the `.gitlab-ci.yml` for an explanation on the script created

---

## Publish Profile and Deployment to IIS 

- To create a `Publish Profile`  and configure the deploy to IIS, refer to [Visual Studio publish profiles (.pubxml) for ASP.NET Core app deployment](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/visual-studio-publish-profiles?view=aspnetcore-6.0)

---

## Running jobs
- After all configurations are made (runner, yml and project) any commit made to the repository should automatically pick-up any valid jobs
- A job might not run if:
  - The ``.gitlab-ci.yml`` does not have a ``tag`` that is listed in the ``runner tags``
  - The ``.gitlab-ci.yml`` has ``conditions`` set that might prevent a job from being executed in the commited branch
  - The ``.gitlab-ci.yml`` has syntax errors
    - Use `CI Lint` to validate your yml script


# Pros / Cons
- (Con) > We already have gitlab present in our workflow. Does not required extra software or licenses
- (Con) > Versioning is done manually
- (Pro) > Supports variables replacing string literals which allows creating a system agnostic yaml file 
- (Pro) > Supports multiple deployment environments in a single yml config file
- (Pro) > Can use xUnit or nUnit to run unit tests in the console (requires console runner nuget package installed into solution)

# References
- [GitLab Keywork Reference](https://docs.gitlab.com/ee/ci/yaml/)
- [GitLab CI/CD with .Net Framework by Gabriel Faraday de Barros](https://medium.com/@gabriel.faraday.barros/gitlab-ci-cd-with-net-framework-39220808b18f)
- [GitLab Beginner Tutorial by Automation Step by Step](https://www.youtube.com/playlist?list=PLhW3qG5bs-L8YSnCiyQ-jD8XfHC2W1NL_)

# Integrating the Yuniql tool into a CI/CD pipeline

## Setup
- Download `Yuniql` to your machine
  - `Invoke-WebRequest -Uri https://github.com/rdagumampan/yuniql/releases/download/latest/yuniql-cli-win-x64-latest.zip -OutFile  "c:\temp\yuniql-win-x64-latest.zip"`
- Extract the contents
  - `Expand-Archive "c:\temp\yuniql-win-x64-latest.zip" -DestinationPath "c:\temp\yuniql-cli"`
- Add ``Yuniql`` the your ``Path``
    - Default location: ``c:\temp\yuniql-cli\yuniql.exe"``
- Navigate to your ``project_folder\Versions`` and execute 
  - `yuniql init`f
- Add `Yuniql` to your `Path`
  - ``$Env:Path += ";c:\temp\yuniql-cli"``

## How to use
- Yuniql requires .NET 6.0 to be installed
- When ``yuniql run`` is issued the first time, it inspects the target database and creates a table to track the versions applied/not applied. 
- When a script is deployed the table is updated to keep track of the changes
- By default the scripts are executed from the `_Versions` folder. To change this behaviour in the ``run/list`` commands use the `-p or --path` flag with the folder path.
  - Check the references for more details
  - The naming scheme for each version folder is ``v0.00``
- To integrate in the GitLab pipeline script is necessary that the GitLab runner service is executed by a user with permissions
  - In `Services.msc` change the user name assigned to a domain user with permissions

## Running Yuniql in the pipeline
- Yuniql can be executed in powershell by using the command: 
  - ``yuniql run  -c "Data Source=<SERVER>;Initial Catalog=<DATABASE>;Persist Security Info=True;User ID=<user>;Password=<password>;Trusted_Connection=True;TrustServerCertificate=True" -a  --platform "sqlserver"``
  - `yuniql run  -p ".\_Versions" -c "Data Source=<SERVER>;Initial Catalog=<DATABASE>;Persist Security Info=True;User ID=<USER>;Password=<PASSWORD>;Trusted_Connection=True;TrustServerCertificate=True" -a  --platform "sqlserver"`
- To format connection string, see [connectionstrings.com](https://www.connectionstrings.com)
  
## Console Commands
- Innitialize DB project structure
  - ``yuniql init``
- Execute deploy
  - ``yuniql run -a``
- Show existing versions applied
  - ``yuniql list``
- Remove database table
  - ``yuniql erase``

## GitIgnore
```
yuniql.exe
yuniql.pdb
yuniqlx.exe
yuniql-log-*.txt
```

## References
- [Yuniql - Get Started](https://yuniql.io/docs/get-started/)
- [Yuniql - How it works](https://yuniql.io/docs/how-yuniql-works/)
- [Yuniql - CLI Command Reference](https://yuniql.io/docs/yuniql-cli-command-reference/)

---

# Managing Jobs using the pipeline

## Purpose
- While usable, the provided gitlab pipeline manager lacks refinement when it comes to the ability of providing validation and security while executing jobs. Like so the following steps aim to provide an explanation on how the API can be used to create an application that can provide better UI to the user

## Requirements
- Pipeline Trigger Token 
  - Unique to each account
  - Can be created in the user profile management page
  - Has an expire date
- A platform for testing API's like Postman or Insomnia

## Making REST calls to the API
- Using your platform of choice and following [GitLab API documentation](https://docs.gitlab.com/ee/api/) you can create REST calls in order to interact with the available data
- The GitLab API uses JSON that can then be serialized/deserialized according to the call your are trying to make
- Authentication
  - When using a tool like Postman or Insomnia click on the `Auth` tab, select `Bearer` and enter your ``personal access token``
  - (Alternative) add `?private_token=<TOKEN>` to the end of every API call

### Examples
- Get all projects 
  - `GET <gitlab_instance>/api/v4/projects?private_token=<TOKEN>`
- Get a project
  - `GET <gitlab_instance>/api/v4/projects/<PROJECT_ID>?private_token=<TOKEN>`
- Get a list all the available jobs for the project
  - ``GET <gitlab_instance>/api/v4/projects/<PROJECT_ID>/jobs?private_token=<TOKEN>``
- Start Job
  - ``POST <gitlab_instance>/api/v4/projects/<PROJECT_ID>/jobs/<JOB_ID>/play?private_token=<TOKEN>``

## Get smaller results
- By using the `simple` argument you can make query with smaller results
- These return only a limited number of fields for each project. 
- This type of call does not require authentication and as such only simple fields are returned.
- Can be used when you don't need the full json data for a given object
- Reduces the ammount of data provided on each object to the essential
- Increases query execution speed

Example:
- Using `simple`
  - `<gitlab_instance>/api/v4/projects/<PROJECT_ID>/pipelines?simple=true&private_token=<TOKEN>`



## Pagination of results
- **By default** Gitlab only provides the top 20 results for your query
- To enable pagination to the api arguments add the argument:
  - `pagination=keyset`
- To manipulate the provide results you can pass arguments like:
   - `per_page = 0 ~ 100`
   - `order_by = <KEY_NAME>`
   - `sort = asc / desc`

Source: [Keyset-based pagination](https://docs.gitlab.com/ee/api/#keyset-based-pagination)

## References
- [GitLab official API documentation](https://docs.gitlab.com/ee/api/)
- [How to make GitLab API calls by GitLab Unfiltered](https://www.youtube.com/watch?v=0LsMC3ZiXkA)
- [JSON to C# builder](https://json2csharp.com/)

---

# Backup and Restore (Files and Database)

## Purpose
- During a deployment multiple factors can result in a failed deployment and as such it's important to have a backup of the already existing application and database prior to deployment

## Requirements
- Powershell
- A source database/application folder
- A destination folder

## Backup

### Database
- In order to backup our database we'll need to define some flags:
  - `-ServerInstance "<server_name>"` > The name of the server that is hosting the database (ex. `SQLSERVER`)
  - `-Database "<database_name>"` > The name of the database that we are making a backup of (ex. ``GitLab_Pipeline_Testing``)
  - `-BackupFile "<path/file_name>"` > The folder and file name that will be generated by our backup (ex. `\\<pc_name>\<path_to_your_userProfile>\source\repos\MainDB.bak`)
- With these flags defined we can build our backup script that will look like this:
  - `Backup-SqlDatabase -ServerInstance "<SERVER>" -Database "GitLab_Pipeline_Testing" -BackupFile "\\<pc_name>\<path_to_your_userProfile>\source\repos\MainDB.bak"`

**Note** > Is not capable of targeting a specific table/set of tables so any backup make for `WebSources` will contain all tables present in that database

### Application Folder
- To build our backup script we'll need to pass some flags to powershell
  - `-Path <folder_path` > The application folder that we want to backup
  - `-DestinationPath <folder_path\<file_name>.zip` > The destination folder where we will save our backup
  - `-Update` > If there's already an existing backup the backup script will crash! By using `-Update` powershell will update the existing backup with the new data
  - `-CompressionLevel <level>` > By omission is set to `Optimal`
    - ``Fastest`` > Uses the fastest compression method available to reduce processing time. Faster compression can result in larger file sizes.
    - ``NoCompression`` > Doesn't compress the source files.
    - ``Optimal`` > Processing time is dependent on file size.
- With these flags defined we can build our backup script that will look like this:
  - `Compress-Archive -Path <folder_path> -Update -DestinationPath <folder_path\<file_name>.zip -CompressionLevel <level>`

## Restore

### Database
- In order to backup our database we'll need to define some flags:
  - `-ServerInstance "<server_name>"` > The name of the server that is hosting the database (ex. `<SERVER>`)
  - `-Database "<database_name>"` > The name of the database where the backup will be deployed to(ex. ``GitLab_Pipeline_Testing``)
  - `-BackupFile "<path/file_name>"` > The folder and file name of the backup (ex. `\\<pc_name>\<path_to_your_userProfile>\source\repos\MainDB.bak`)
- With these flags defined we can build our backup script that will look like this:
  - `Restore-SqlDatabase -ServerInstance "<SERVER>" -Database "GitLab_Pipeline_Testing" -BackupFile "\\<pc_name>\<path_to_your_userProfile>\source\repos\MainDB.bak"` 

### Application Folder
- To build our backup script we'll need to pass some flags to powershell
  - `-LiteralPath <folder_path\<file_name>.zip` > The backup file that we will use to restore from
  - `-DestinationPath <folder_path>` > The destination folder to which our backup will be applied
- With these flags defined we can build our backup script that will look like this:
  - `Expand-Archive -LiteralPath '<folder_path\<file_name>.zip' -DestinationPath <folder_path>`

## References
- [Backup-SqlDatabase by Microsoft](https://docs.microsoft.com/en-us/powershell/module/sqlserver/backup-sqldatabase?view=sqlserver-ps)
- [Restore-SqlDatabase by Microsoft](https://docs.microsoft.com/en-us/powershell/module/sqlserver/restore-sqldatabase?view=sqlserver-ps)
- [Compress-Archive](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.archive/compress-archive?view=powershell-7.2)
- [Expand-Archive by Microsoft](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-7.2)

---

# Handling Job Failures
- Uses the `when` keyword to specify running conditions
- `on_failure` keyword is triggered by the first job failure of a pipeline
- [Source: When](https://docs.gitlab.com/ee/ci/yaml/index.html#when)

## Usage
1. Script validates if the backup file exists
  1. If backup exists executes the restore job
  2. If backup does not exist trigger pipeline failure

## Check if a file exists
- To build our backup script we'll need to pass some flags to powershell
  - `-Path <folder_path` > The folder containing our backup files
  - (Optional) `-PathType <element_type>` > The type of element we are looking for
    - `Leaf` > An element that does not contain other elements, such as a file.
    - `Container` > An element that contains other elements, such as a directory or registry key.
    - `Any` > Either a `Leaf` or a `Container`
- With these flags defined we can build our backup script that will look like this:
  - `Test-Path -Path <folder_path>`
  - `Test-Path -Path <folder_path> -PathType <element_type>`

---

# Workflow

## Development
### Conditions for start
- Developer commits a change to the code

### Job Sequence
1. (manual) Commit
2. (auto) Restores nugets/node packages
3. (auto) Builds project>>>>If failed abort pipeline
4. (auto) Runs unit tests (nUnit3)   >>>>   If failed abort pipeline
5. (auto) Sonarqube Analysis
6. (auto) Sends notification to the developer that the pipeline has finished successfully

## Beta

### Conditions for start
- Development pipeline has concluded successfully
- Sonarqube approved the code with a grade of <X> or greater
- Merge has been approved by Senior Developer

### Job Sequence
1. (manual / triggers following job) Merge is accepted
2. (auto) Restores nugets/node packages
3. (auto) Builds project   >>>>   If failed abort pipeline
4. (auto) Runs unit tests (nUnit3)   >>>>   If failed abort pipeline
5. (auto) Send e-mail notification requesting approval for deploy
6. (manual) Deployment
    1. Lead Developer authorizes the deployment (signature)   >>>>   Lead Developer can reject deployment (?)   >>>>   Abort pipeline
    2. When required signatures are present the next job is triggered 
    3. (auto) Send e-mail notification informing that the deployment has been approved
6. (auto) Application is changed to "Maintenance" mode
7. (auto) Application backup is created
    1. If does not exist create
    2. If already exists update
8. (auto) Database backup is created
    1. If does not exist create
    2. If already exists update
9. (auto) SQL scripts are deployed  >>>>   If application deployment fails trigger restore job (app and database)   >>>>   Abort pipeline
10. (auto) Application is deployed   >>>>   If application deployment fails trigger restore job (app and database)   >>>>   Abort pipeline
11. (auto) Notification is sent to Lead Developer that the deployment has concluded
12. (on fail) If exists restore database and application backups   >>>>   Abort pipeline

## Production

### Conditions for start
- Beta pipeline has concluded successfully
- QA team has approved deployment
- Merge has been approved by Senior Dev

### Job Sequence
1. (manual / triggers following job) Merge is accepted
2. (auto) Restores nugets/node packages
3. (auto) Builds project   >>>>   If failed abort pipeline
4. (auto) Runs unit tests (nUnit3)   >>>>   If failed abort pipeline
5. (auto) Send e-mail notification requesting approval for deploy
6. (manual) Deployment
    1. Lead Developer authorizes the deployment (signature)   >>>>   Lead Developer can reject deployment (?)   >>>>   Abort pipeline
    2. QA team authorizes the deployment (signature)   >>>>   QA Team can reject deployment (?)   >>>>   Abort pipeline
    3. When required signatures are present the next job is triggered 
    4. (auto) Send e-mail notification informing that the deployment has been approved
6. (auto) Application is changed to "Maintenance" mode
7. (auto) Application backup
    1. If does not exist create
    2. If already exists update
8. (auto) Database backup is created
    1. If does not exist create
    2. If already exists update
9. (auto) SQL scripts are deployed  >>>>   If application deployment fails trigger restore job (app and database)   >>>>   Abort pipeline
10. (auto) Application is deployed   >>>>   If application deployment fails trigger restore job (app and database)   >>>>   Abort pipeline
11. (auto) Notification is sent to Lead Developer that the deployment has concluded
12. (on fail) If exists restore database and application backups   >>>>   Abort pipeline

# Authentication
- Although it's not pratical to use the login and password we are able to use personnal tokens that identify the user.
- When triggering a pipeline the GitLab system will register the logged in user
- When triggering a job the pipeline will register the user by reading the provided token
- `$GITLAB_USER_NAME` can be injeted in our pipeline jobs to provide the display name of the user that triggered the action
- With this we can develop a UI application that uses a bot's personnal account to make the API call's and the users token to trigger the jobs making sure that the user is always being tracked properly.

# Requirements / Notes
- A user with enough access to the database to run backup/restore scripts
- A user with enough access to the project folder and the backup folder to run backup/restore scripts
- Instead of using a per user token we can use a single token generated with a long expiry date for a bot and request the user token during the deployment approval stage