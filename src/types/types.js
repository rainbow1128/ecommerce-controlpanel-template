export const types = {
    // UI
    uiOpenModal: '[ui] Open Modal',
    uiCloseModal: '[ui] Close Modal',

    // Auth
    authCheckingFinish: '[auth] Finish checking login state',
    authStartLogin: '[auth] Start login',
    authLogin: '[auth] Login',
    authStartRegister: '[auth] Start Register',
    authStartTokenRenew: '[auth] Start token renew',
    authLogout: '[auth] Logout',

    // Token
    getToken : '[token] Got it',
    saveToken : '[token] Saved',
    updateToken : '[token] Updated',
    deleteToken : '[token] Deleted',

    // Users
    usersAuth: '[users] User authenticated',
    usersLoaded: '[users] Users loaded',
    userUpdated: '[users] Updating user',
    userDeleted: '[users] Deleting user',
    userAvatarDeleted: '[users] Avatar deleted',

    //Products
    productLoaded: '[products] Products loaded',
    productEdit: '[products] Products edit',
    productUpdate: '[products] Products updating',
    productCleanActive: '[products] Products clean product actived',

    //Categories
    categoriesLoaded: '[categories] Categories loaded',
    categoryEdit: '[categories] Categories edit',
    categoryCleanActive: '[categories] Categories clean category actived',
}