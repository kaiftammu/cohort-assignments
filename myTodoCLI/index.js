import { time } from "console";
import fs from "fs";

const command = process.argv[2];
const todotext = process.argv[3];
// reading 
let todos = JSON.parse(fs.readFileSync("todos.json", "utf-8"));

// adding
if (command === "add") {
    const todotext = process.argv.slice(3).join(" ");

    todos.push({ task: todotext, done: false });
    fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2));
    console.log(`added todos ${todotext}`);
} else if (command === "delete") {
    const index = parseInt(process.argv[3]);
    // todos is already defined as an array above

    if (isNaN(index) || index < 1 || index > todos.length) {
        console.log("❌invalid index");
    } else {
        const removed = todos.splice(index - 1, 1);
        fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2));
        console.log(`✅Deleted:${removed[0].task}`);
    }
}else if (command==="list"){
    const todos=JSON.parse(fs.readFileSync("todos.json","utf-8"));

    if(todos.length===0){
        console.log("no todos yet!");
    }else{
        console.log("your todos:");
        todos.forEach((todo,i) => {
            const status=todo.done?"✅":"❌";
            console.log(`${i+1}.${status} ${todo.task}`);
        });
    }

}else if(command==="done"){
    const index=parseInt(process.argv[3]);
    if(isNaN(index)||index<1||index>todos.length){
        console.log("❌Invalid index");
    }else{
        todos[index-1].done=true;
        fs.writeFileSync("todos.json",JSON.stringify(todos,null,2));
        console.log(`✅Marked as Done:${todos[index-1].task}`);
    }

}else if(command==="clear"){
    todos=[];
    fs.writeFileSync("todos.json",JSON.stringify(todos,null,2));
    console.log("🧹Cleared all todos");

}else if(command==="edit"){
    const index = parseInt(process.argv[3]);
    const newText = process.argv.slice(4).join(" ");

    if(isNaN(index)||index<1||index>todos.length){
        console.log("❌ invalid index");
    }else{
        todos[index-1].task=newText;
        fs.writeFileSync("todos.json",JSON.stringify(todos,null,2));
        console.log(`✏️ Edited todo ${index}:${newText}`);
    }
}else {
    console.log("unknown command");
}
