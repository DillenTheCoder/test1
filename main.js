const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { connectDB, createMember, findMemberById, getAllMembers, deleteMember } = require('./database');

// Connect to DB when app starts
app.whenReady().then(() => {
  connectDB();
  createWindow();
});

// Add these IPC handlers
ipcMain.handle('create-member', async (event, memberData) => {
  return await createMember(memberData);
});

ipcMain.handle('find-member', async (event, idNumber) => {
  return await findMemberById(idNumber);
});

ipcMain.handle('get-all-members', async () => {
  return await getAllMembers();
});

ipcMain.handle('delete-member', async (event, idNumber) => {
  return await deleteMember(idNumber);
});