const somethingIsLoading = { loading: false }
const trainingSteps = {
  steps: [],
  showTour: true,
  currentStep: 0,
  loadGroups: [],
  userCompleted: [false]
}
//const supportIssues = { loading: true, myIssues: {}, globalIssues: {} }
const initialState = {
  trainingSteps,
//  supportIssues,
  somethingIsLoading,
}

export default initialState
