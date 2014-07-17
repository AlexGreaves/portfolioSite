(function(window,undefined){
    var History = window.History; // Note: We are using a capital H instead of a lower h
    trace(History.enabled);
    if ( !History.enabled ) {
        trace(History);
        trace('word up');
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }
    trace('yo');
    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log(State.data, State.title, State.url);
    });

        // Capture all the links to push their url to the history stack and trigger the StateChange Event
        $(document).on("click", ".tile, .thumb", function(e) {
            var $a = $(this).data('content');
            e.preventDefault();
            History.pushState({data:$a}, 'test string', $a.href);
        });
    // Change our States
    // History.pushState({state:1}, "State 1", "?state=1"); // logs {state:1}, "State 1", "?state=1"
    // History.pushState({state:2}, "State 2", "?state=2"); // logs {state:2}, "State 2", "?state=2"
    // History.replaceState({state:3}, "State 3", "?state=3"); // logs {state:3}, "State 3", "?state=3"
    // History.pushState(null, null, "?state=4"); // logs {}, '', "?state=4"
    // History.back(); // logs {state:3}, "State 3", "?state=3"
    // History.back(); // logs {state:1}, "State 1", "?state=1"
    // History.back(); // logs {}, "Home Page", "?"
    // History.go(2); // logs {state:3}, "State 3", "?state=3"

})(window);