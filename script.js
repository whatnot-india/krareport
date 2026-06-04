let data = {};

const container =
    document.getElementById(
        "works"
    );

fetch(
    "./questions.json"
)

    .then(
        r => r.json()
    )

    .then(json => {

        data = json;

        loadDepartments();

    });

function loadDepartments() {

    const select =
        document
            .getElementById(
                "department"
            );

    data.departments
        .forEach(dep => {

            select.innerHTML +=

                `<option>

${dep}

</option>`;

        });

}

function showQuestions() {
    document.getElementById(
"reportingTo"
);


    if (
        !employee.value
        ||
        !company.value
        ||
        !email.value
        ||

        !designation.value
        ||

        !department.value
        ||
        !reportingTo.value.trim()
    ) {

        alert(
            "Please complete employee details"
        );

        return;

    }

    document
        .getElementById(
            "questionSection"
        )
        .style.display =
        "block";

    document
        .getElementById(
            "submitBtn"
        )
        .style.display =
        "block";

    document
        .getElementById(
            "employeeFeedback"
        )
        .style.display =
        "block";

    loadQuestions();

    window.scrollTo({

        top:
            document
                .getElementById(
                    "questionSection"
                )
                .offsetTop,

        behavior:
            "smooth"

    });

}

function loadQuestions() {

    container.innerHTML = "";

    const questions =

        data.questions[
        department.value
        ]

        ||

        [];

    questions.forEach(work => {

        container.innerHTML += `

<div class="work">

<label>

<input
type="checkbox"

onchange=
"toggle(this)"

>

<b>

${work}

</b>

</label>

<div class="hidden">

<label>

Explain Work

</label>

<textarea></textarea>

<label>

Time Spent

</label>

<select>

<option>
Less than 1 Hour
</option>

<option>
1–2 Hours
</option>

<option>
2–4 Hours
</option>

<option>
4–6 Hours
</option>

<option>
More than 6 Hours
</option>

</select>

<label>

Contribution Score

</label>

<div class="scoreGroup">

<label class="scoreItem">

<input
type="radio"
name="score_${work}"

value="1">

<span>1</span>

</label>

<label class="scoreItem">

<input
type="radio"
name="score_${work}"

value="2">

<span>2</span>

</label>

<label class="scoreItem">

<input
type="radio"
name="score_${work}"

value="3">

<span>3</span>

</label>

<label class="scoreItem">

<input
type="radio"
name="score_${work}"

value="4">

<span>4</span>

</label>

<label class="scoreItem">

<input
type="radio"
name="score_${work}"

value="5">

<span>5</span>

</label>

</div>

</div>

</div>

`;

    });

}

function toggle(el) {

    el
        .closest(
            ".work"
        )
        .querySelector(
            ".hidden"
        )
        .style.display =

        el.checked

            ?

            "block"

            :

            "none";

}

function submitForm() {

    clearErrors();

    let works = [];

    let hasError = false;

    document
        .querySelectorAll(".work")
        .forEach(w => {

            const checked =
                w.querySelector(
                    'input[type="checkbox"]'
                );

            if (!checked.checked)
                return;

            const explain =
                w.querySelector(
                    "textarea"
                );

            const time =
                w.querySelector(
                    "select"
                );

            const score =
                w.querySelector(
                    'input[type="radio"]:checked'
                );

            const workName =
                w.querySelector(
                    "b"
                ).innerText;

            let valid = true;

            if (
                !explain.value.trim()
            ) {

                valid = false;

                showError(
                    explain,
                    "Please explain your work"
                );

                liveValidation(
                    explain
                );

            }

            if (
                !score
            ) {

                valid = false;

                showScoreError(
                    w
                );

                liveScoreValidation(
                    w
                );

            }

            if (!valid) {

                hasError = true;

                return;

            }

            works.push({

                name:
                    workName,

                explain:
                    explain.value.trim(),

                time:
                    time.value,

                score:
                    score.value

            });

        });

    /* Additional Details Validation */


    const concerns =

        document.getElementById(
            "concerns"
        );

    const grooming =

        document.getElementById(
            "grooming"
        );

    let extraError = false;

    if (
        !concerns.value.trim()
    ) {

        showError(

            concerns,

            "Please share concerns or mention NA"

        );

        liveValidation(
            concerns
        );

        extraError = true;

    }

    if (
        !grooming.value
    ) {

        showError(

            grooming,

            "Select grooming response"

        );

        grooming.addEventListener(

            "change",

            () => {

                grooming.classList.remove(
                    "error"
                );

                grooming
                    .nextElementSibling
                    ?.remove();

            },

            {

                once: true

            }

        );

        extraError = true;

    }

    if (

        hasError
        ||

        extraError

    ) {

        document
            .querySelector(
                ".error"
            )
            ?.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        return;

    }

    submitToSheet(
        works
    );

}

function submitToSheet(works) {

    const submitBtn =

        document.getElementById(
            "submitBtn"
        );

    // prevent double click

    if (
        submitBtn.disabled
    )
        return;

    // loading

    submitBtn.disabled =
        true;

    submitBtn.innerHTML =
        `
        <div class="loader"></div>
        Submitting...
        `;

    const payload = {

        employee:
            employee.value,
        company:
company.value,  

        email:
            email.value,

        department:
            department.value,

        designation:
            designation.value,

        reportingTo:
            reportingTo.value,

        concerns:
            concerns.value,

        grooming:
            grooming.value,

        works

    };

    let iframe =

        document.getElementById(
            "hiddenFrame"
        );

    if (!iframe) {

        iframe =

            document.createElement(
                "iframe"
            );

        iframe.id =
            "hiddenFrame";

        iframe.name =
            "hiddenFrame";

        iframe.style.display =
            "none";

        document.body
            .appendChild(
                iframe

            );

    }

    const form =

        document.createElement(
            "form"
        );

    form.method =
        "POST";

    form.action =
        "https://script.google.com/macros/s/AKfycbwnMyrlM8tXRMNvB1yUedFjOOJCSrJBo_GlD5zheZ2KkwrlQ9LNWpro9xwwQ1gPOFIFkg/exec";

    form.target =
        "hiddenFrame";

    const hidden =

        document.createElement(
            "input"
        );

    hidden.type =
        "hidden";

    hidden.name =
        "data";

    hidden.value =
        JSON.stringify(
            payload
        );

    form.appendChild(
        hidden

    );

    document.body
        .appendChild(
            form

        );

    form.submit();

    setTimeout(() => {

        document.querySelector(
            ".container"
        ).innerHTML =

            `
            
            <div class="successScreen">
            
            <div class="successIcon">
            
            ✓
            
            </div>
            
            <h1>
            
            Form Submitted Successfully
            
            </h1>
            
            <p>
            
            Thank you for completing your KRA.
            
            Your contribution helps the team perform better and grow together.
            
            Keep doing great work 🚀
            
            </p>
            
            <div class="successFooter">
            
            Your response has been recorded.
            
            </div>
            
            </div>
            
            `;

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }, 2000);

}

function showError(

    field,

    message

) {

    field.classList.add(
        "error"
    );

    const msg =
        document.createElement(
            "div"
        );

    msg.className =
        "errorText";

    msg.innerText =
        message;

    field.after(
        msg
    );

}

function showScoreError(

    work

) {

    const msg =
        document.createElement(
            "div"
        );

    msg.className =
        "scoreError";

    msg.innerText =
        "Select contribution score";

    work
        .querySelector(
            ".scoreGroup"
        )
        .after(
            msg
        );

}

function clearErrors() {

    document
        .querySelectorAll(
            ".error"
        )
        .forEach(
            x =>
                x.classList.remove(
                    "error"
                )
        );

    document
        .querySelectorAll(
            ".errorText,.scoreError"
        )
        .forEach(
            x =>
                x.remove()
        );

}

function liveValidation(

    field

) {

    field.addEventListener(

        "input",

        () => {

            field
                .classList.remove(
                    "error"
                );

            field
                .nextElementSibling
                ?.remove();

        },

        {

            once: true

        }

    );

}

function liveScoreValidation(

    work

) {

    work
        .querySelectorAll(
            'input[type="radio"]'
        )
        .forEach(r => {

            r.addEventListener(

                "change",

                () => {

                    work
                        .querySelector(
                            ".scoreError"
                        )
                        ?.remove();

                },

                {

                    once: true

                }

            );

        });

}
