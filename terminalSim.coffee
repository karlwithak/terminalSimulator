# classes ----------------------------------------
class Node 
    constructor: (@val, @usage, @descript, @left = null, @right = null) ->
    add: (n) ->
        if n.val < @val 
            if not @left then @left = n
            else @left.add n
        else
            if not @right then @right = n
            else @right.add n
    find: (s) ->
        if @val.indexOf(s, 0) is 0
            print2 @val
            if @left then @left.find s
            if @right then @right.find s
        else if s < @val and @left then @left.find s
        else if @right then @right.find s   
    search: (searchVal) ->
        if @val is searchVal then this
        else if searchVal < @val and @left then @left.search searchVal
        else if @right then @right.search searchVal     
   

# variables ---------------------------------------
allCommands = [new Node("clear", "~$ clear" , "clears the screen"),
               new Node("color", "~$ color [name of color]", "changes color of the text"),
               new Node("background", "~$ background [name of background{laser, clouds, rainbow}]", "leave terminal to see other background"),
               new Node("about", "~$ about", "learn more about this terminal"),
               new Node("features", "~$ features", "learn more about the features of this terminal"),
               new Node("info", "~$ redirect", "redirect to my information page"),
               new Node("exit", "~$ exit", "leave terminal and go to my website"),
               new Node("quit", "~$ quit", "same as exit"),
               new Node("restart", "~$ restart", "restarts this terminal"),
               new Node("projects", "~$ projects", "redirects to my project page"),
               new Node("source", "~$ source", "view CoffeeScript source for this terminal")]
commandTree = new Node("help", "~$ help | ~$ help [command name]", "see possible commands, or learn more about a specific command") 
commandTree.add command for command in allCommands    
helpText = "Available commands: <br> <b>#{commandTree.val}</b>: #{commandTree.descript}"
helpText += "<br><b>#{x.val}</b>: #{x.descript}" for x in allCommands

aboutText = """this is a terminal simulator created by Nicholas Hrynuik using CoffeeScript and jQuery<br>
            type 'help' for all commands"""
featureText = """
           Available features:<br>
            tab: autocomplete commmand<br>
            up/down arrows: itterate through command history<br>
            !!: run last command
            """
$("#container").height $(window).height()-30
callback = ""
recallNum = 0
commands = [] 
text = $("#text")
text2 = $("#text2")
inputBox = $("#input")

# functions ---------------------------------------
print = (s) -> text.append "#{s} <br>"      
print2 = (s) -> text2.append "#{s} <br>"      
helpPrint = (n) -> 
    if(n) then print "<b>#{n.val}</b><br>info: #{n.descript}<br>usage: #{n.usage}"
    else print "no matching command found. Type <b>'help'</b> for it"
color = (arg) ->
    if arg
        temp = $("#container").css "color"
        $("#container").css "color", arg
        inputBox.css "color", arg
        if text.css("color") is temp then print "invalid color"                   
    else print "usage: color [color value]"         
background = (arg) ->
    if !arg then print "usage: background [name of background{clouds, laser, rainbow}]"   
    else if arg in ["clouds", "laser", "rainbow"] then redirect "http://csclub.uwaterloo.ca/~nkhrynui/?#{arg}"
    else print "invalid background" 
redirect = (arg) ->
     print "this action will result in the exit of this terminal. Continue? y/n"
     callback = "window.location.href = '#{arg}'"
excecute = (fun) ->
   (new Function(fun))()        
    
# input handler  ---------------------------------------
inputHandler = ->
    recallNum = commands.length
    commands.push inputBox.val()
    input = inputBox.val().split ' '
    print "~$ #{input.join " "}" 
    if callback isnt "" and input[0].substring(0,1) is "y"
        print "redirecting..."
        excecute(callback);
        callback = ""   
    else if callback isnt "" and input[0].substring(0,1) is "n"
            callback = ""
            print "command cleared"
    else if callback isnt "" then print "please choose y/n"
    else switch input[0]
        when "help"
            if input[1] then helpPrint(commandTree.search input[1])
            else print helpText
        when "clear" then text.empty()  
        when "color" then color input[1]                     
        when "background" then background input[1] 
        when "exit", "quit" then redirect "http://csclub.uwaterloo.ca/~nkhrynui"
        when "projects" then redirect "http://csclub.uwaterloo.ca/~nkhrynui/projects"
        when "info" then redirect "http://csclub.uwaterloo.ca/~nkhrynui/info"
        when "about" then print aboutText
        when "features" then print featureText
        when "restart" then redirect document.URL
        when "source" then redirect "https://github.com/karlwithak/terminalSimulator"
        when "!!" 
            inputBox.val commands[commands.length-2]
            inputHandler()
            return
        else print "invalid command, type <b>'help'</b> for all commands"             
    inputBox.val " "
    inputBox.val ""
    if text.height()>$("body").height() then $("html, body").animate  scrollTop: $(document).height() , 0

# listeners ---------------------------------------
inputBox[0].onkeydown = (e) ->
    key = (if e.keyCode then e.keyCode else e.which)
    if key is 38 and recallNum >=0
        e.preventDefault()
        if inputBox.val() is commands[recallNum-1] then recallNum-=2                   
        inputBox.val commands[recallNum--]    
    else if key is 40 and recallNum isnt commands.length
        e.preventDefault()
        if inputBox.val() is commands[recallNum+1] then recallNum+=2                    
        inputBox.val commands[recallNum++]  
    else if key is 13 then inputHandler() and text2.empty()
    else if key is 9 
                e.preventDefault()
                text2.empty()
                if inputBox.val().length >0 then commandTree.find inputBox.val()
                if text2.children().size() == 1
                    inputBox.val text2.html().replace(" <br>","")
                    text2.empty()
    #inputBox[0].selectionStart = inputBox[0].selectionEnd = inputBox[0].value.length
$(document).click -> inputBox[0].focus()
