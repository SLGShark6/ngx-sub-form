# NgxSubForm

![ngx-sub-form logo](https://user-images.githubusercontent.com/4950209/53812385-45f48900-3f53-11e9-8687-b57cd335f26e.png)

Utility library to improve the robustness of your Angular forms.

Whether you have simple and tiny forms or huge and complex ones, `ngx-sub-form` will help you build a solid base for them.

- 🗜️ Tiny bundle (< 15kb)
- ✅ Simple API: No angular module to setup, no inheritance, no boilerplate. Only one function to create all your forms!
- 🤖 Adds type safety to your forms
- ✂️ Lets you break down huge forms into smaller ones for simplicity and reusability

_Please note one thing: If your goal is to generate forms dynamically (based on some JSON configuration for example) `ngx-sub-form` is not here for that!_

# Table of content

- Basic API usage
- Setup
- Migration guide to the new API
- Principles
  - Root forms
  - Sub forms
  - Remap
- How does `ngx-sub-form` works under the hood?

# Basic API usage

Quick overlook at the API before explaining in details further on:

![basic-api-usage](https://user-images.githubusercontent.com/4950209/102610857-2f222500-412e-11eb-86b5-135a7e96b3f1.png)

# Setup

`ngx-sub-form` is available on [NPM](https://www.npmjs.com/package/ngx-sub-form):

```
npm i ngx-sub-form
```

**Note about the versions:**

| `@angular` version | `ngx-sub-form` version |
| ------------------ | ---------------------- |
| <= `7`             | <= `2.7.1`             |
| `8.x`              | `4.x`                  |
| `9.x`              | `5.1.2`                |
| >= `10.x`          | `6.0.0`                |

The bump from version `5.1.2` to `6.0.0` doesn't bring any changes to the `ngx-sub-form` you where using before `6.0.0`. No bug fixes, no features. It's only a major bump for Angular 10 support and you should be able to upgrade without touching any of your forms.

That said, the version `6.0.0` also brings some exiting news! We sneaked into that release a [complete rewrite of ngx-sub-form to get rid of inheritance](https://github.com/cloudnc/ngx-sub-form/issues/171) 🎉. The best part being: **It's been done in a non breaking way to guarantee a smooth upgrade, which can be done incrementally, one form at a time, from the old API to the new one**.

The old API has been marked as deprecated and will be removed when we make a breaking change for Angular 12 upgrade.

# Migration guide to the new API

If your project is not using `ngx-sub-form` yet, feel free to skip this migration guide.  
On the other hand, if your project is using `ngx-sub-form` with the inheritance API please read the following.

TODO

# Principles

As simple as forms can look when they only have a few fields, their complexity can increase quite fast. In order to keep your code as simple as possible and isolate the different concepts, we do recommend to write forms in complete isolation from the rest of your app.

In order to do so, you can create some top level form that we call "**root forms**". As one form can become bigger and bigger over time, we also help by letting you create "**sub forms**" (without the pain of dealing manually with a [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor)!). Lets dig into their specificities, how they differ and how to use them.

<!-- ## For every form

Before we explain any further, here's how any form would look:

```ts
@Component({
  selector: 'person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
})
export class PersonFormComponent {
  public form = createForm<Person>(this, {
    // ...
    formControls: {
      name: new FormControl(null, Validators.required),
      age: new FormControl(null, Validators.required),
    },
  });
}
``` -->

## Root forms

Root forms let you isolate a form from the rest of your app.  
You can encapsulate them and never deal `patchValue` or `setValue` to update the form nor subscribe to `valueChanges` to listen to the updates.

Instead, you'll be able to create a dedicated form component and pass data using an input, receive updates using an output. Just like you would for a dumb component.

Let's have a look with a very simple workflow:

- A smart component listens to a `personId` param in the current route and makes an HTTP call to retrieve some extra data about that person
- A root form component lets us display the data we retrieved and also edit them

```ts
@Component({
  selector: 'person-container',
  template: `
    <person-form [person]="person$ | async" (personUpdate)="personUpdate$$.next()"></person-form>
  `,
  styleUrls: ['./person-form.component.scss'],
})
export class PersonContainer {
  public personUpdate$$: Subject<Person> = new Subject();

  public personId$: Observable<string> = this.route.paramMap.pipe(map(params => params.get('personId')));

  public person$: Observable<Person> = combineLatest(
    // fetch the person every time the person ID changes in the URL
    // and every time the form is updated
    this.personId$,
    this.personUpdate$$.pipe(startWith(null)),
  ).pipe(switchMap(([personId]) => this.http.get<Person>(`https://my-api.com/people/${personId}`)));

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.personUpdate$$
      .pipe(
        switchMap(personUpdate => this.http.post<Person>(`https://my-api.com/people/${personId}`, personUpdate)),
        takeUntilDestroy(this),
      )
      .subscribe();
  }
}
```

## Sub forms

## Remap
