var Node, aboutText, allCommands, background, callback, color, command, commandTree, commands, excecute, featureText, helpPrint, helpText, inputBox, inputHandler, print, print2, recallNum, redirect, text, text2, x, _i, _j, _len, _len1;

Node = (function() {
  function Node(val, usage, descript, left, right) {
    this.val = val;
    this.usage = usage;
    this.descript = descript;
    this.left = left != null ? left : null;
    this.right = right != null ? right : null;
  }

  Node.prototype.add = function(n) {
    if (n.val < this.val) {
      if (!this.left) {
        return this.left = n;
      } else {
        return this.left.add(n);
      }
    } else {
      if (!this.right) {
        return this.right = n;
      } else {
        return this.right.add(n);
      }
    }
  };

  Node.prototype.find = function(s) {
    if (this.val.indexOf(s, 0) === 0) {
      print2(this.val);
      if (this.left) {
        this.left.find(s);
      }
      if (this.right) {
        return this.right.find(s);
      }
    } else if (s < this.val && this.left) {
      return this.left.find(s);
    } else if (this.right) {
      return this.right.find(s);
    }
  };

  Node.prototype.search = function(searchVal) {
    if (this.val === searchVal) {
      return this;
    } else if (searchVal < this.val && this.left) {
      return this.left.search(searchVal);
    } else if (this.right) {
      return this.right.search(searchVal);
    }
  };

  return Node;

})();

allCommands = [new Node("clear", "~$ clear", "clears the screen"), new Node("color", "~$ color [name of color]", "changes color of the text"), new Node("background", "~$ background [name of background{laser, clouds, rainbow}]", "leave terminal to see other background"), new Node("about", "~$ about", "learn more about this terminal"), new Node("features", "~$ features", "learn more about the features of this terminal"), new Node("info", "~$ redirect", "redirect to my information page"), new Node("exit", "~$ exit", "leave terminal and go to my website"), new Node("quit", "~$ quit", "same as exit"), new Node("restart", "~$ restart", "restarts this terminal"), new Node("projects", "~$ projects", "redirects to my project page"), new Node("source", "~$ source", "view CoffeeScript source for this terminal")];

commandTree = new Node("help", "~$ help | ~$ help [command name]", "see possible commands, or learn more about a specific command");

for (_i = 0, _len = allCommands.length; _i < _len; _i++) {
  command = allCommands[_i];
  commandTree.add(command);
}

helpText = "Available commands: <br> <b>" + commandTree.val + "</b>: " + commandTree.descript;

for (_j = 0, _len1 = allCommands.length; _j < _len1; _j++) {
  x = allCommands[_j];
  helpText += "<br><b>" + x.val + "</b>: " + x.descript;
}

aboutText = "this is a terminal simulator created by Nicholas Hrynuik using CoffeeScript and jQuery<br>\ntype 'help' for all commands";

featureText = "Available features:<br>\n tab: autocomplete commmand<br>\n up/down arrows: itterate through command history<br>\n !!: run last command";

$("#container").height($(window).height() - 30);

callback = "";

recallNum = 0;

commands = [];

text = $("#text");

text2 = $("#text2");

inputBox = $("#input");

print = function(s) {
  return text.append("" + s + " <br>");
};

print2 = function(s) {
  return text2.append("" + s + " <br>");
};

helpPrint = function(n) {
  if (n) {
    return print("<b>" + n.val + "</b><br>info: " + n.descript + "<br>usage: " + n.usage);
  } else {
    return print("no matching command found. Type <b>'help'</b> for it");
  }
};

color = function(arg) {
  var temp;
  if (arg) {
    temp = $("#container").css("color");
    $("#container").css("color", arg);
    inputBox.css("color", arg);
    if (text.css("color") === temp) {
      return print("invalid color");
    }
  } else {
    return print("usage: color [color value]");
  }
};

background = function(arg) {
  if (!arg) {
    return print("usage: background [name of background{clouds, laser, rainbow}]");
  } else if (arg === "clouds" || arg === "laser" || arg === "rainbow") {
    return redirect("http://csclub.uwaterloo.ca/~nkhrynui/?" + arg);
  } else {
    return print("invalid background");
  }
};

redirect = function(arg) {
  print("this action will result in the exit of this terminal. Continue? y/n");
  return callback = "window.location.href = '" + arg + "'";
};

excecute = function(fun) {
  return (new Function(fun))();
};

inputHandler = function() {
  var input;
  recallNum = commands.length;
  commands.push(inputBox.val());
  input = inputBox.val().split(' ');
  print("~$ " + (input.join(" ")));
  if (callback !== "" && input[0].substring(0, 1) === "y") {
    print("redirecting...");
    excecute(callback);
    callback = "";
  } else if (callback !== "" && input[0].substring(0, 1) === "n") {
    callback = "";
    print("command cleared");
  } else if (callback !== "") {
    print("please choose y/n");
  } else {
    switch (input[0]) {
      case "help":
        if (input[1]) {
          helpPrint(commandTree.search(input[1]));
        } else {
          print(helpText);
        }
        break;
      case "clear":
        text.empty();
        break;
      case "color":
        color(input[1]);
        break;
      case "background":
        background(input[1]);
        break;
      case "exit":
      case "quit":
        redirect("http://csclub.uwaterloo.ca/~nkhrynui");
        break;
      case "projects":
        redirect("http://csclub.uwaterloo.ca/~nkhrynui/projects");
        break;
      case "info":
        redirect("http://csclub.uwaterloo.ca/~nkhrynui/info");
        break;
      case "about":
        print(aboutText);
        break;
      case "features":
        print(featureText);
        break;
      case "restart":
        redirect(document.URL);
        break;
      case "source":
        redirect("https://github.com/karlwithak/terminalSimulator");
        break;
      case "!!":
        inputBox.val(commands[commands.length - 2]);
        inputHandler();
        return;
      default:
        print("invalid command, type <b>'help'</b> for all commands");
    }
  }
  inputBox.val(" ");
  inputBox.val("");
  if (text.height() > $("body").height()) {
    return $("html, body").animate({
      scrollTop: $(document).height()
    }, 0);
  }
};

inputBox[0].onkeydown = function(e) {
  var key;
  key = (e.keyCode ? e.keyCode : e.which);
  if (key === 38 && recallNum >= 0) {
    e.preventDefault();
    if (inputBox.val() === commands[recallNum - 1]) {
      recallNum -= 2;
    }
    return inputBox.val(commands[recallNum--]);
  } else if (key === 40 && recallNum !== commands.length) {
    e.preventDefault();
    if (inputBox.val() === commands[recallNum + 1]) {
      recallNum += 2;
    }
    return inputBox.val(commands[recallNum++]);
  } else if (key === 13) {
    return inputHandler() && text2.empty();
  } else if (key === 9) {
    e.preventDefault();
    text2.empty();
    if (inputBox.val().length > 0) {
      commandTree.find(inputBox.val());
    }
    if (text2.children().size() === 1) {
      inputBox.val(text2.html().replace(" <br>", ""));
      return text2.empty();
    }
  }
};

$(document).click(function() {
  return inputBox[0].focus();
});
