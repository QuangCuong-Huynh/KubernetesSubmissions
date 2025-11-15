# Create project with Vite (modern, fast)
#npm create vite@latest kanban-app -- --template react
cd kanban-app

# Create complete folder structure
mkdir -p src/{api,models,viewmodels,components/{common,Board,Task,User},features/{kanban,auth,settings},hooks,contexts,routes,styles,utils}
mkdir -p tests/{unit/{models,viewmodels,api,hooks,contexts,utils,routes},integration/features,e2e,mocks,fixtures,support}