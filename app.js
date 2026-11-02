'use strict';
const $ = (id) => document.getElementById(id);
const state = {tasks: [], editingId: null, config: null};
function showStatus(message, error = false) { $('status-message').textContent = message; $('status-message').classList.toggle('error', error); }
function updateCounts() { $('total-count').textContent = state.tasks.length; $('pending-count').textContent = state.tasks.filter(x => !x.completed).length; $('complete-count').textContent = state.tasks.filter(x => x.completed).length; }
function makeButton(text, cssClass, handler) {const button = document.createElement('button'); button.type='button';button.textContent=text;button.className=cssClass;button.addEventListener('click',handler);return button;}
function renderTasks() {
 const list=$('task-list');list.replaceChildren();updateCounts();
 if(!state.tasks.length){const empty=document.createElement('div');empty.className='empty';empty.textContent='No tasks yet. Create your first task!';list.appendChild(empty);return;}
 for(const task of state.tasks){
  const item=document.createElement('article');item.className='task-item'+(task.completed?' done':'');item.dataset.id=String(task.id);
  const header=document.createElement('div');header.className='task-main';
  const title=document.createElement('h3');title.className='task-title';title.textContent=task.title;
  const status=document.createElement('span');status.className='task-status';status.textContent=task.completed?'Completed':'In progress';header.append(title,status);
  const description=document.createElement('p');description.className='task-description';description.textContent=task.description||'No description added.';
  const actions=document.createElement('div');actions.className='task-actions';
  actions.append(makeButton(task.completed?'↶ Mark incomplete':'✓ Mark complete','toggle-task',()=>toggleTask(task)),makeButton('Edit','edit-task',()=>startEdit(task)),makeButton('Delete','delete-task',()=>deleteTask(task)));
  item.append(header,description,actions);list.append(item);
 }
}
function apiHeaders(){return {'apikey':state.config.supabasePublishableKey,'Content-Type':'application/json'};}
async function request(path, options={}) {
 const url=`${state.config.supabaseUrl.replace(/\/$/,'')}/rest/v1/${state.config.tableName}${path}`;
 let response;
 try{response=await fetch(url,{...options,headers:{...apiHeaders(),...(options.headers||{})}});}catch(e){throw new Error('Cannot reach Supabase. Check your connection and project settings.');}
 if(!response.ok){let detail='';try{const body=await response.json();detail=body.message||body.error||'';}catch{}throw new Error(`Database error (${response.status})${detail?': '+detail:''}`);}
 if(response.status===204)return null;const body=await response.text();return body?JSON.parse(body):null;
}
async function loadTasks(){try{showStatus('Loading tasks...');const result=await request('?select=*&order=id.desc');state.tasks=result||[];renderTasks();showStatus('');}catch(e){showStatus(e.message,true);}}
function resetForm() {state.editingId=null;$('task-form').reset();$('form-heading').textContent='Create a task';$('task-submit').innerHTML='Add Task <span aria-hidden="true">→</span>';$('cancel-edit').classList.add('hidden');}
function startEdit(task){state.editingId=task.id;$('task-title').value=task.title;$('task-description').value=task.description||'';$('form-heading').textContent='Edit task';$('task-submit').textContent='Save Changes';$('cancel-edit').classList.remove('hidden');$('task-title').focus();window.scrollTo({top:0,behavior:'smooth'});}
async function saveTask(event){event.preventDefault();const title=$('task-title').value.trim();const description=$('task-description').value.trim();if(!title){showStatus('Please enter a task title.',true);return;}
 const submit=$('task-submit');submit.disabled=true;
 try{if(state.editingId!==null){await request(`?id=eq.${encodeURIComponent(state.editingId)}`,{method:'PATCH',body:JSON.stringify({title,description})});}else{await request('',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({title,description,completed:false})});}resetForm();await loadTasks();showStatus('Task saved successfully.');}catch(e){showStatus(e.message,true);}finally{submit.disabled=false;}}
async function toggleTask(task){try{await request(`?id=eq.${encodeURIComponent(task.id)}`,{method:'PATCH',body:JSON.stringify({completed:!task.completed})});await loadTasks();showStatus('Task status updated.');}catch(e){showStatus(e.message,true);}}
async function deleteTask(task){if(!confirm(`Delete "${task.title}"?`))return;try{await request(`?id=eq.${encodeURIComponent(task.id)}`,{method:'DELETE'});if(state.editingId===task.id)resetForm();await loadTasks();showStatus('Task deleted.');}catch(e){showStatus(e.message,true);}}
async function init(){ $('task-form').addEventListener('submit',saveTask);$('cancel-edit').addEventListener('click',resetForm);$('refresh-tasks').addEventListener('click',loadTasks);
 try{const res=await fetch('config.json',{cache:'no-store'});if(!res.ok)throw new Error('Could not load config.json');const config=await res.json();if(!config.supabaseUrl||!config.supabasePublishableKey||config.tableName!=='tasks'||config.supabaseUrl.includes('YOUR_PROJECT')||config.supabasePublishableKey.includes('YOUR_'))throw new Error('Supabase is not configured yet. Add your project URL and publishable key to config.json.');state.config=config;await loadTasks();}catch(e){showStatus(e.message,true);$('task-list').innerHTML='<div class="empty">Connect Supabase to get started.</div>';}}
init();
