# index
Git superproject containing the folder structure, sub repositories and dev tools. Start here!

## Directory Overview
- `/docs`: Directory containing Aurelia's wiki, technical documents and post mortems
- `/infra`: Submodule with entire declarative infrastructure as code, using Terraform/OpenTofu
- `/lib`: Shared libraries
- `/scripts`: Development scripts to make our lifes easier
- `/services`: Aurelia's applications and services deployed in our infra

-- Create contributing docs -- 
## Requirements
- Docker (daemon, compose)

## Installation
Start by cloning the repository with all the submodules:
```sh
git clone --recurse-submodules git@github.com:AureliaTech/_index.git ~/dev/aurelia
```

Extend the project git configuration with yours. Any setting on your global git config file will be applied to this repository also.
This is useful for sharing common Git configurations across multiple repositories without duplicating settings.
```sh
git config --local include.path ~/.gitconfig
```

Setup your company user email and github user (we will not be signing the commits for the moment):
```sh
git config --local user.email=[your.name]@opstream.app
git config --local github.user=@[your.username]
```
-- Add signing commits instructions --
-- Add setup instructions: 2FA github, SSH key generation, cli's installation --


## Run Local Dev Environment
Once Aurelia's directory has been created and all the repos cloned, you can run all the services locally for development:
```sh
docker-compose -f docker-compose.dev.yaml up -d
```
-- Move run local environment command to a script or makefile --

## Todo
- Add signing commits instructions
- Add setup instructions: 2FA github, SSH key generation, cli's installation
- Create contributing docs: First day installation, our workflow (dev, deploy to beta, QA + PR, deploy to prod)
- Move run local environment command to a script or a makefile

## Submodules
```sh
# Add a submodule
git submodule add <URL> <PATH>

# See list of submodules
git submodule status
```
Settings:
```sh
# Enable recursion for relevant commands
git config --local submodule.recurse true

# Get net code
git fetch
git pull --rebase
```
