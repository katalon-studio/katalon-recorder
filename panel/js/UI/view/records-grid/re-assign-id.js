import { getRecordsArray } from "./get-records-array.js";

// according to "ID" to set odd/even class
const classifyRecords = (start, end) => {
    let i = start;
    let node;
    try {
        if (i % 2 === 1) {
            while (i <= end) {
                node = document.getElementById("records-" + i);
                if (!node.className || node.className === "odd" || node.className === "even") {
                    node.className = "odd";
                }
                i = parseInt(i) + 1;
                node = document.getElementById("records-" + i);
                if (!node.className || node.className === "odd" || node.className === "even") {
                    node.className = "even";
                }
                i = parseInt(i) + 1;
            }
        } else {
            while (i <= end) {
                node = document.getElementById("records-" + i);
                if (!node.className || node.className === "odd" || node.className === "even") {
                    node.className = "even";
                }
                i = parseInt(i) + 1;
                node = document.getElementById("records-" + i);
                if (!node.className || node.className === "odd" || node.className === "even") {
                    node.className = "odd";
                }
                i = parseInt(i) + 1;
            }
        }
    } catch (e) {}
}

// according to <tr> array's "order" to reassign id
const reAssignId = (start, end) => {
    const records = getRecordsArray();
    start = parseInt(start.split("-")[1]);
    end = parseInt(end.split("-")[1]);
    let len = end - start;

    if (len > 0) {
        records[end - 1].id = "records-" + end;
        for (let i = start; i < start + len; ++i) {
            records[i - 1].id = "records-" + i;
        }
        classifyRecords(start, end);
    } else if (len < 0) {
        records[end].id = "records-" + (end + 1);
        len *= -1;
        for (let i = end + 1; i < end + len; ++i) {
            records[i].id = "records-" + (i + 1);
        }
        classifyRecords(end, start);
    } else {
        records[start - 1].id = "records-" + start;
        classifyRecords(start, end);
    }
}

const reAssignIdForDelete = (delete_ID, count) => {
    const records = getRecordsArray();
    for (let i = delete_ID - 1; i < count; ++i) {
        records[i].id = "records-" + (i + 1);
    }
    classifyRecords(delete_ID, count);
}

export { reAssignId, reAssignIdForDelete, classifyRecords }