const somethingIsLoading = { loading: false }
const userPreferences = {loading:true,userPreferences:[]}
const trainingSteps = {
  steps: [],
  showTour: true,
  currentStep: 0,
  loadGroups: [],
  registered: false,
  userCompleted: [false]
}
//const supportIssues = { loading: true, myIssues: {}, globalIssues: {} }
const initialState = {
  trainingSteps,
//  supportIssues,
  somethingIsLoading,
  userPreferences
}

export default initialState
