const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  userId: (state) => state.user.user.userId,
  avatar: (state) => state.user.user.staffPhot,
  name: (state) => state.user.user.username
}
export default getters
