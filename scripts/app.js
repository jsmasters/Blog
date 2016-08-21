(function () {

    // Create your own kinvey application

    let baseUrl = "https://baas.kinvey.com";
    let appKey = "kid_H1K7S3r9"; // Place your appKey from Kinvey here...
    let appSecret = "6e5e9bd7faa14fc2a60cb28383982132"; // Place your appSecret from Kinvey here...
    var _guestCredentials = "edd1bd56-92f6-4a62-a472-c23dea567923.mRUtzcfn8yir6zpYNuaH2FvOjxbpuE8RDSbe4rUq1sM="; // Create a guest user using PostMan/RESTClient/Fiddler and place his authtoken here...

    //Create AuthorizationService and Requester

    let selector = ".wrapper";
    let mainContentSelector = ".main-content";

    let authService = new AuthorizationService(baseUrl, appKey, appSecret, _guestCredentials);
    authService.initAuthorizationType("Kinvey");

    let requester = new Requester(authService);

    let homeView = new HomeView(selector, mainContentSelector);
    let homeController = new HomeController(homeView, requester, baseUrl, appKey);

    let userView = new UserView(selector, mainContentSelector);
    let userController = new UserController(userView, requester, baseUrl, appKey);

    let postView = new PostView(selector, mainContentSelector);
    let postController = new PostController(postView, requester, baseUrl, appKey);

    // Create HomeView, HomeController, UserView, UserController, PostView and PostController

    initEventServices();

    onRoute("#/", function () {
        if(!authService.isLoggedIn()) {
            homeController.showGuestPage();
        } else {
            homeController.showUserPage();
        }
        // Check if user is logged in and if its not show the guest page, otherwise show the user page...
    });

    onRoute("#/post-:id", function () {
        let top = $('#post-' + this.params['id']).position().top;
        $(window).scrollTop(top);
        // Create a redirect to one of the recent posts...
    });

    onRoute("templates/login.html", function () {
        userController.showLoginPage(authService.isLoggedIn());
        // Show the login page...
    });

    onRoute("templates/register", function () {
        userController.showRegisterPage(authService.isLoggedIn());
        // Show the register page...
    });

    onRoute("#/logout", function () {
        userController.logout();
        // Logout the current user...
    });

    onRoute('#/posts/create', function () {
        let data = {
            fullname: sessionStorage['fullname']
        };

        postController.showCreatePostPage(data, authService.isLoggedIn());
        // Show the new post page...
    });

    bindEventHandler('login', function (ev, data) {
        userController.login(data);
        // Login the user...
    });

    bindEventHandler('register', function (ev, data) {
        userController.register(data);
        // Register a new user...
    });

    bindEventHandler('createPost', function (ev, data) {
        postController.createPost(data);
        // Create a new post...
    });

    run('#/');
})();
