I did this project during my internship in SmartPulse company. Mainly, I developed this project to learn how to develop a web application using React in the frontend and .Net Core in the backend. 

# Description 

The project is basically a web application where users could register/sign in themselves, in addition to their ability to edit their profile and change their email and password. Furthermore, in this project I demonstrated how to fetch data from a public API related to power plants and organize it in grids and give the user the ability to edit this data and save the edit version in a database. Users are also able to upload data themselves in the form of Excel files. These files are then processed using a console application that should work in the background as a Windows task. The data from successfully processed files is also added to the database, and users are able to access data from both the API and the database.

Various packages and libraries were used to Implement this application like:

1. .Net Core API and Console application
	- Entity Framework Core 
	- Epplus
	- and more ... 
2. React 
	- Material-UI React 
	- Ag-Grid 
	- and more ... 
3. Database 
	- SQL Server with SQL Server Management Studio


The pictures below try to show you how the application would look like if you run it on your machine. 

# .Net Core API

The API gives the user the ability to access data and manipulate it. 

## Folder Structure 
<img src="Pictures\dotNetCore\FolderStructure.png" width=300> 

# React 

This is the client application where the the frontend is implemented and the user can access the functionality offered by the application. 

## Folder Structure  
<img src="Pictures\React\FolderStructure.png" width=300> 



## Login Page
<img src="Pictures\React\LoginPage\LoginPage.png" width=800> 



## Home Page

###  Select Menu
<img src="Pictures\React\HomePage\Select.png" width=800> 

###  Sidebar
<img src="Pictures\React\HomePage\Sidebar.png" width=800> 

### Ag-Grid 
<img src="Pictures\React\HomePage\Ag-Grid.png" width=800> 

###  Material-UI Grid
<img src="Pictures\React\HomePage\MaterialUIGrid.png" width=800> 

###  Material-UI Grid 2
<img src="Pictures\React\HomePage\MaterialUIGrid2.png" width=800> 




## OrderPage 

### OrderPage 
<img src="Pictures\React\OrderPage\OrderPage.png" width=800> 

### DatePicker 
<img src="Pictures\React\OrderPage\DatePicker.png" width=800> 



## Profile Page 
<img src="Pictures\React\ProfilePage\ProfilePage.png" width=800> 


# Console App 

This application will work in the background as a windows task to process newly added Excel files and check if the time of any order has come to execute it. 

## Console App Example Log 
<img src="Pictures\ConsoleApp\ConsoleAppLog1.png" width=800> 

## Console App Example Log 2
<img src="Pictures\ConsoleApp\ConsoleAppLog2.png" width=800> 

## Setting up a Windows Task
<img src="Pictures\ConsoleApp\SetUpWindowsTask.png" width=800> 

## The automatically created Excel File 
<img src="Pictures\ConsoleApp\CreatedExcelFile.png" width=800> 