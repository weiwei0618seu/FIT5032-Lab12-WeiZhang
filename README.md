# FIT5032 Lab 5 — Events, Data Binding, and Secure Routing

This Vue 3 application extends the Week 4 library project with event handling,
two-way data binding, Vue Router navigation, and a demonstration-only protected
members area.

## Features

- Password confirmation validation triggered on blur
- Reactive feedback when the reason contains the word `friend`
- Vue DevTools support for inspecting `formData`
- Home and About views using Vue Router
- Hardcoded demonstration login and protected About route
- Access Denied and logout flows
- Existing PrimeVue DataTable and Lab 4 form validation

## Demonstration Login

The following hardcoded credentials are for the assessed lab demonstration only:

```text
Username: admin
Password: password123
```

## Project Setup

```sh
npm install
```

### Run the Development Server

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

## Lab Report

The LaTeX report and screenshot checker are in the `report` directory. After
copying the required PNG files into that directory, run:

```sh
node report/check-screenshots.mjs
```
