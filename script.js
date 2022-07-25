function Get() {
    let url = 'http://<your_gitlab_instance>/api/v4/projects?private_token=<your_private_token>';

    fetch(url).then(response => response.json())
        .then(out => {

            document.getElementById("div1").style.display = "block";
            document.getElementById("div2").style.display = "none";

            for (var i = 0; i < out.length; i++) {
                var select = document.getElementById('target3');
                var option = document.createElement('option')

                option.innerHTML = out[i].name
                option.value = out[i].id;
                select.appendChild(option)

                var table = document.getElementById("table");
                var row = table.insertRow(1);

                var cell1 = row.insertCell(0); // ID
                var cell2 = row.insertCell(1); // Name
                var cell3 = row.insertCell(2); // Created_at
                var cell4 = row.insertCell(3); // Web_url

                cell1.innerHTML = out[i].id;
                cell2.innerHTML = out[i].name;
                cell3.innerHTML = out[i].created_at;
                cell4.innerHTML = out[i].web_url;
            }
        })
        .catch(err => { alert(err) });
}

function val() {
    var select = document.getElementById("target3");
    var index = select.options[select.selectedIndex];

    let url = `http://<your_gitlab_instance>/api/v4/projects/${index.value}/jobs?private_token=<your_private_token>`;

    fetch(url).then(response => response.json())
        .then(out => {
            console.log(out.id)

            var table = document.getElementById("table");
            var table2 = document.getElementById("table2");

            document.getElementById("div1").style.display = "none";
            document.getElementById("div2").style.display = "block";

            while (table2.rows.length > 1) {
                table2.deleteRow(1);
            }

            for (var i = 0; i < out.length; i++) {
                if (out[i].status == "manual") {
                    var row = table2.insertRow(1);

                    var cell1 = row.insertCell(0); // ID
                    var cell2 = row.insertCell(1); // Name
                    var cell3 = row.insertCell(2); // Created_at
                    var cell4 = row.insertCell(3); // Web_url
                    var cell5 = row.insertCell(4); // Pipeline
                    var cell6 = row.insertCell(5); // Trigger

                    cell1.innerHTML = out[i].id;
                    cell2.innerHTML = out[i].name;
                    cell3.innerHTML = out[i].status;
                    cell4.innerHTML = out[i].ref;
                    cell5.innerHTML = out[i].pipeline.id;
                    cell6.innerHTML = `<button onclick="TriggerJob(${index.value}, ${out[i].id})"><i class="fa fa-play" aria-hidden="true"></i> Start</button>`;
                }
            }
        })
        .catch(err => { alert(err) });

}

function TriggerJob(projectID, jobID) {

    fetch(`http://<your_gitlab_instance>/api/v4/projects/${projectID}/jobs/${jobID}/play?private_token=<your_private_token>`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    })

    Email.send({
        Host: "<your_domail_email_host>",
        To: '<email>',
        From: "<email>",
        Subject: "It works!",
        Body: "It works!!!",
    })

};