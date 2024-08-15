window.onload = () => {
  // display alert after page loads
  if (document.readyState == "loaded" || document.readyState == "complete")
    alert(
      "Welcome to the Elevator System! \n\nPlease note that the elevator has a guest limit of 5. \n\nClick 'OK' to continue."
    );
  const checkbox = document.getElementById("toggle");
  const body = document.body;

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      body.style.backgroundColor = "#272751"; // Change to your desired color
    } else {
      body.style.backgroundColor = "white"; // Reset to default color
    }
  });

  let elevator = document.querySelector(".elevator");
  let elevatorDoor = elevator.querySelector(".elevator-door");
  let elevatorLight = elevator.querySelector(".elevator-light");
  let floors = document.querySelectorAll(".building .floor");
  let buttons = document.querySelectorAll(".handle button");
  let display = document.querySelector(".display");

  var destinyFloors = [];
  var currentFloor = null;
  var leavingFloor = false;
  var elevatorStatus = "idle";
  var elevatorWaitingTime = 2000;
  var elevatorWaitTime = 2000;
  var previousTime = new Date().getTime();
  var deltaTime = 0;
  var buttonPressCount = 0;

  elevatorDoor.style.width = "1px";
  elevator.style.offsetTop = floors[0].offsetTop + "px";
  // moving, opening, waiting, closing, idle

  if (localStorage.getItem("maintenance") == "true") {
    elevatorLight.style.backgroundColor = "red";
  } else {
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        buttonPressCount++;

        if (buttonPressCount < 5) {
          let setFloor = this.getAttribute("data-set-floor");
          let selectedFloor = Array.prototype.slice
            .apply(document.querySelectorAll(".building .floor"))
            .filter((f) => f.getAttribute("data-floor") == setFloor)[0];

          if (
            destinyFloors.find(
              (df) =>
                df.getAttribute("data-floor") ==
                selectedFloor.getAttribute("data-floor")
            ) == null
          ) {
            if (
              selectedFloor.getAttribute("data-floor") !=
              currentFloor.getAttribute("data-floor")
            ) {
              destinyFloors.push(selectedFloor);
            }
          }
          leavingFloor = true;
          if (elevatorStatus == "idle") {
            elevatorStatus = "closing";
          }
        }
      });
    });

    if (buttonPressCount < 5) {
      function updateElevator() {
        deltaTime = new Date().getTime() - previousTime;
        previousTime = new Date().getTime();

        requestAnimationFrame(updateElevator);
        // console.log(elevator.offsetTop)
        var elevatorWithinFloor = false;
        for (let i = 0; i < floors.length; i++) {
          if (
            elevator.offsetTop > floors[i].offsetTop &&
            elevator.offsetTop < floors[i].offsetTop + 10
          ) {
            // console.log("elevator within floor "+i);
            elevatorWithinFloor = true;
            currentFloor = floors[i];

            if (!leavingFloor) {
              if (
                destinyFloors.some(
                  (df) =>
                    df.getAttribute("data-floor") ==
                    currentFloor.getAttribute("data-floor")
                )
              ) {
                // console.log("Reached floor")
                destinyFloors = destinyFloors.filter(
                  (df) =>
                    df.getAttribute("data-floor") !=
                    currentFloor.getAttribute("data-floor")
                );
                elevatorStatus = "opening";
              }
            } else {
              // console.log("Leaving floor")
            }
          }
        }

        if (!elevatorWithinFloor) {
          // console.log("Elevator out of any floor")
          if (leavingFloor) {
            leavingFloor = false;
          }
        }

        if (elevatorStatus != "moving") {
          if (elevatorStatus == "opening") {
            if (elevatorDoor.offsetWidth > 1) {
              elevatorDoor.style.width = elevatorDoor.offsetWidth - 1 + "px";
            } else {
              if (destinyFloors.length == 0) {
                elevatorStatus = "idle";
              } else {
                elevatorStatus = "waiting";
                elevatorWaitingTime = elevatorWaitTime;
              }
            }
          }
          if (elevatorStatus == "waiting") {
            if (elevatorWaitingTime > 0) {
              elevatorWaitingTime -= deltaTime;
            } else {
              elevatorStatus = "closing";
            }
          }
          if (elevatorStatus == "closing") {
            if (elevatorDoor.offsetWidth < 34) {
              elevatorDoor.style.width = elevatorDoor.offsetWidth + 1 + "px";
            } else {
              elevatorStatus = "moving";
            }
          }
        }

        if (destinyFloors[0] != null && elevatorStatus == "moving") {
          if (destinyFloors[0].offsetTop > elevator.offsetTop - 7) {
            elevator.style.top = elevator.offsetTop - 7 + 2 + "px";
          } else {
            elevator.style.top = elevator.offsetTop - 7 - 2 + "px";
          }
        }

        updateButtons();
        updateDisplay();
      }
      updateElevator();
    }
  }

  function updateDisplay() {
    if (localStorage.getItem("maintenance") == "true") {
      display.innerHTML = "\nOut of service";
    } else if (buttonPressCount > 5) {
      elevatorLight.style.backgroundColor = "red";
      display.innerHTML = "\n guest limit reached";
    } else {
      display.innerHTML =
        [
          "Ground Floor",
          "First Floor",
          "Second Floor",
          "Third Floor",
          "Fourth Floor",
          "Fifth Floor",
          "Sixth Floor",
        ][parseInt(currentFloor.getAttribute("data-floor"))] +
        " " +
        (destinyFloors[0] != null
          ? destinyFloors[0].offsetTop < currentFloor.offsetTop
            ? "<br />Going UP"
            : "<br />Going Down"
          : "");
    }
  }

  function updateButtons() {
    buttons.forEach((button) => {
      if (
        destinyFloors.find(
          (df) =>
            df.getAttribute("data-floor") ==
            button.getAttribute("data-set-floor")
        )
      ) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }
};
