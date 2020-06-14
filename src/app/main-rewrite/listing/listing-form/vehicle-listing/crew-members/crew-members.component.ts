import { Component, forwardRef } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { ArrayPropertyKey, ArrayPropertyValue, subformComponentProviders } from 'ngx-sub-form';
import { createForm, NgxSubForm } from '../../../../../../../projects/ngx-sub-form/src/lib/new/ngx-sub-form';
import { FormType } from '../../../../../../../projects/ngx-sub-form/src/lib/new/ngx-sub-form.types';
import { CrewMember } from '../../../../../interfaces/crew-member.interface';

interface CrewMembersForm {
  crewMembers: CrewMember[];
}

@NgxSubForm()
@Component({
  selector: 'app-crew-members',
  templateUrl: './crew-members.component.html',
  styleUrls: ['./crew-members.component.scss'],
  providers: subformComponentProviders(forwardRef(() => CrewMembersComponent)),
})
export class CrewMembersComponent {
  public form = createForm<CrewMember[], CrewMembersForm>(this, {
    formType: FormType.SUB,
    formControls: {
      crewMembers: new FormArray([]),
    },
    toFormGroup: (obj: CrewMember[]): CrewMembersForm => {
      return {
        crewMembers: !obj ? [] : obj,
      };
    },
    fromFormGroup: (formValue: CrewMembersForm): CrewMember[] => {
      return formValue.crewMembers;
    },
    createFormArrayControl: (
      key: ArrayPropertyKey<CrewMembersForm> | undefined,
      value: ArrayPropertyValue<CrewMembersForm>,
    ) => {
      switch (key) {
        case 'crewMembers':
          return new FormControl(value, [Validators.required]);
        default:
          return new FormControl(value);
      }
    },
  });

  public removeCrewMember(index: number): void {
    this.form.formGroup.controls.crewMembers.removeAt(index);
  }

  public addCrewMember(): void {
    this.form.formGroup.controls.crewMembers.push(
      this.form.createFormArrayControl('crewMembers', {
        firstName: '',
        lastName: '',
      }),
    );
  }
}