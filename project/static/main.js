// custom javascript

(function() {
  console.log('Sanity Check!');
})();

function handleClick(type) {
  fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type: type }),
  })
  .then(response => response.json())
  .then(data => {
    appendLoading(data.task_id);
    getStatus(data.task_id);
  })
}


function appendLoading(taskID) {
  const html = `
  <tr id="loading-${taskID}">
    <td>${taskID}</td>
    <td>Loading...</td>
    <td>Waiting for result...</td>
  </tr>`;
  const newRow = document.getElementById('tasks').insertRow(0);
  newRow.innerHTML = html;
}

function getStatus(taskID) {
  fetch(`/tasks/${taskID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(res => {
    console.log(res)
    const taskStatus = res.task_status;
    if (taskStatus === 'SUCCESS' || taskStatus === 'FAILURE') {
       const html = `
        <tr>
          <td>${taskID}</td>
          <td>${res.task_status}</td>
          <td>${res.task_result}</td>
        </tr>`;
      const newRow = document.getElementById('tasks').insertRow(0);
      newRow.innerHTML = html;
      return false;
    } else {
      setTimeout(function() {
        getStatus(res.task_id);
      }, 1000);
    }
  })
  .catch(err => console.log(err));
}
