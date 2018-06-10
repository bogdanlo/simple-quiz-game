(function () {

function Question(theQuestion, theChoices, theCorrectAnswer) {
   // Initialize the instance properties
   this.question = theQuestion;
   this.possibleAnswers = theChoices;
   this.correctAnswer = theCorrectAnswer;
   this.userAnswer = "";

}

// Define prototype methods:
Question.prototype.getCorrectAnswer = function () {
   return  this.correctAnswer;
};

Question.prototype.getUserAnswer = function () {
  return this.userAnswer;
};

Question.prototype.displayQuestion = function () {
   let questionToDisplay = "<div class='radio'><div class='question'>" + this.question + "</div>";
       answerCount = 0;

   this.possibleAnswers.forEach(function (eachChoice)  {
       questionToDisplay += '<div class="answDiv"><input type="radio" name="choice" id ="' + answerCount + '" value="' + answerCount + '"><label for="' + answerCount + '">' + eachChoice + '</label>' + "</div>";
       answerCount++;
   });
   questionToDisplay += "</div>";

   return questionToDisplay;
};

function MultipleChoiceQuestion(theQuestion, theChoices, theCorrectAnswer){
  Question.call(this, theQuestion, theChoices, theCorrectAnswer);
}

MultipleChoiceQuestion.prototype = Object.create(Question.prototype);

let quiz;

// Start Quiz
$(document).ready(function(){
  $("#start").on('click',function(){
    quiz = new Quiz();
    quiz.start();
    quiz.showQuestion();
    $("#start").hide();
  });
});

//set user answer on answer selection
$("#showQuestion").on("click","input", function() {
  quiz.getQuestion().userAnswer = $("input:checked").val();
  if(!$("#submit").length) {
    let submit = $('<button id="submit">Submit</button>');
    $('#showQuestion').append(submit);
  }
});
//Users presses the submit button
$("#showQuestion").on("click","#submit", function() {
  quiz.submit();
  $("#submit").prop('disabled', true);
  $("#submit").hide();
  if(quiz.nextQuestion()) { // checks if there is a next question
    let next = $('<button id="next">Next Question</button>');
    $('#showQuestion').append(next);
  } else {
    let score = $('<button id="score">Show Score</button>');
    $('#showQuestion').append(score); //score is html
  }
});
//User presses the next button
$("#showQuestion").on("click","#next", function() {
  $("#next").prop('disabled', true);
  quiz.showQuestion();
});


// Score button
$("#showQuestion").on("click", "#score", function() {
    quiz.showScore();
    $("#start").show();
    $("#start").text("Try Again!");
});



let Quiz = function() {
  let currentQ = 0;
  let correct = 0;
  let answers = [];
  let allQuestions = [];
 

  $.getJSON("./src/questions.json", function(data) {
    $.each( data, function(key, val) {
      val.forEach(function(elem) {
        allQuestions.push(new MultipleChoiceQuestion(elem.question, elem.answers, elem.correct));
      });
    });
  });

  this.start = function() {
    currentQ = 0;
  };

  this.nextQuestion = function() {
    currentQ++;
    return currentQ < allQuestions.length;
  };

  this.prev = function() {
    currentQ--;
  };

  this.firstQuestion = function() {
    return currentQ === 0 ? true : false;
  };

  this.showQuestion = function () {
    $('#showQuestion').fadeOut('fast', complete);
    function complete() {
      $('#showQuestion').html(quiz.getQuestion().displayQuestion());
      $('#showQuestion').fadeIn("fast");
      if(answers[currentQ]){
        $('#'+ answers[currentQ]).prop('checked', true);
        let submit = $('<button id="submit">Submit Answer</button>');
        $('#showQuestion').append(submit);
      }
    }
  };

  this.getQuestion = function() {
    return allQuestions[currentQ];
  };

  this.submit = function() {
    answers[currentQ] = (quiz.getQuestion().getUserAnswer());
    correct += quiz.getQuestion().getUserAnswer() == quiz.getQuestion().getCorrectAnswer() ? 1 : 0;
  };

  this.showScore = function() {
    $('#showQuestion').html('<div id="scoreDiv">You got: ' + correct + ' answers right out of ' + allQuestions.length + ' questions.</div>');
  };
};
})();