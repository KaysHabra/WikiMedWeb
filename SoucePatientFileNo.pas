// procedure TForm_ApptsSystem.ActionCreateModifyFileNoExecute(Sender: TObject);
// var IDAcc,ID_Dept,IDPatient,Acc_Num,IDF,Acc_PNum,Result:integer;
// //    v:Variant;
//     s,Value:String;
//     good:Boolean;
//     IDDoctor,IDBranch:integer;
// begin
//      IDPatient:=CDPatients['IDP'].AsInteger;
//      IDAcc:=CDPatients['IDAcc'].AsInteger;
//      Acc_Num:=0;


//      if IDAcc<=0 then
//      begin
//           if adm.MakeAttendToAppointment(ActionManager1.PermissionID,IDAcc,0,0,IDPatient) then
//           begin
//                if IDAcc>0 then
//                if LocatPatient(IDPatient,True) then
//                begin
//                     DataConnection1.DIConnections.FindDIConnection(E_IDAcc).UpdateCaptions;
//                     DataConnection1.DIConnections.FindDIConnection(E_IDAcc).RefreashRelation;
//                end;
//           end;
//      End Else
//      Begin
//           s:=QueryValueAsString('Select concat_ws(",",IDF,Ac_PNum,Ac_Num) from acc where IDC=%d and IDP=%d',[pr.DefaultCompany,IDAcc]);

//           IDF     :=StrToNo(GetTheWord(0,s));
//           Acc_PNum:=StrToNo(GetTheWord(1,s));
//           Acc_Num :=StrToNo(GetTheWord(2,s));

//           Value:=intTostr(Acc_Num);
//           good:=False;
//           while not good do
//           begin
//                if InputQuery('FileNo Editor','محرر رقم الملف', 'File No','رقم الملف', Value) then
//                begin
//                     if isNo(Value) and (Value<>intTostr(Acc_Num)) then
//                     begin
//                          s:=QueryValueAsString('Select concat_ws(",",IDP,NameE,NameA) from acc a where (a.IDC,a.Ac_Num)=(%d,%s) and IDF in(Select distinct IDMainPatientsAcc from departments where IDC=%d) limit 1',
//                                              [PR.DefaultCompany,Value,PR.DefaultCompany]);
//                          if trim(s)='' then
//                          begin
//                               UseBufferForQuery:=True;
//                               IDF:=QueryValueAsInteger('Select IDMainPatientsAcc from ( '+
//                                                        'Select d.IDMainPatientsAcc ,Max(a.Ac_Num) MaxAc_Num,Min(a.Ac_Num) MinAc_Num '+
//                                                        'from departments d Left join acc a on a.IDC=d.IDC and d.IDMainPatientsAcc=a.IDF '+
//                                                        'where d.IDC=%d '+
//                                                        'group by a.IDf '+
//                                                        'having (%d between MinAc_Num and MaxAc_Num) or %d>MaxAc_Num)a '+
//                                                        'order by MinAc_Num desc limit 1',[PR.DefaultCompany,StrToInt(Value),StrToInt(Value)]);
//                               if IDF<=0 then
//                               begin
//                                    ShowError('ID Main Patients Account folder not exist','رقم الحساب الرئيسي للمرضى غير معرف ');
//                                    Exit;
//                               end;

//                               RunQuery('Update Acc Set AccOld=Ac_Num,IDF=%d,Ac_Num=%s where (IDC,IDP)=(%d,%d)',[IDF,Value,PR.DefaultCompany,IDAcc]);
//                               RunQuery('Update Patients Set Description=concat_ws(",",Description,"OldFileNo=%d") where (IDC,IDP)=(%d,%d)',[Acc_Num,PR.DefaultCompany,IDpatient]);

//                               if LocatPatient(IDPatient,True) then
//                               begin
//                                    DataConnection1.DIConnections.FindDIConnection(E_IDAcc).UpdateCaptions;
//                                    DataConnection1.DIConnections.FindDIConnection(E_IDAcc).RefreashRelation;
//                               end;
//                               good:=True;
//                          end else
//                          begin
//                               ShowError('This file No is used by other patient','رقم الملف مستخدم من قبل مريض آخر',
//                                         s);
//                          end;
//                     end;
//                end else
//                    good:=True;
//           end;
//      End;

// end;

************************

Function TADM.MakeAttendToAppointment(FormPermissionID:integer   ;var IDAcc:integer;AIDY,IDAppointment: integer;IDPatient:integer=0;IDMainPatientsAcc:integer=0):Boolean;
const q='Select d.IDP, d.Dept_Name_Ar, d.Dept_Name_Eng,a.NameE AccountNameE,a.nameA AccountNameA, d.IDMainPatientsAcc '+
        'From departments d '+
        'inner join Acc a on d.idc=a.idc and d.IDMainPatientsAcc=a.idp '+
        'Where d.IDC=%d %s '+
        'Group by d.IDMainPatientsAcc';
var Acc_Num,IDDoctor:integer;
    AIDBranch:Integer;
    s:String;
    good:Boolean;

  R: integer;
  IDMainAcc: Integer;
begin
     Result:=False;
     AIDBranch:=0;R:=0;
     IDMainAcc:=0;
     if AIDY<=0 then
        AIDY:=LocalParametrs.PR.DefaultFinancialYear;
     if (IDAppointment>0) and (IDPatient>0) then
     with OpenQuery('Select a.* from appointments a inner join ApptPatients t on a.idc=t.idc and a.IDY=t.IDY and a.idp=t.idAppt '+
                    'Where a.idc=%d and a.IDY=%d and a.idP=%d and t.idpatient=%d',
                                     [LocalParametrs.PR.DefaultCompany,AIDY,IDAppointment,IDPatient]) do
     try
        Me.Open;
        if Me.RecordCount>0 then
        begin
             if RunQuery('Update appointments a inner join ApptPatients t on a.idc=t.idc and a.IDY=t.IDY and a.idp=t.idAppt '+
                      'Set t.AttendTime="%s"  ,t.Attend=1,   t.AttendUser=%d '+
                      'Where a.idc=%d and a.idy=%d and a.idP=%d and t.idpatient=%d',
                                     [TimeToSQL(adm.ServerTime),LocalParametrs.PR.UserID,
                                      LocalParametrs.PR.DefaultCompany,AIDY,IDAppointment,IDPatient]) then
             begin
                  adm.AddToUserSession(FormPermissionID,2008,
                      Me['IDC'].AsInteger,
                      Me['IDY'].AsInteger,
                      Me['IDBranch'].AsInteger,0,
                      IDAppointment,
                      0,0,'Save Appointment Attend',
                      Dm.PR_AsInteger('Points_Appt_Attend','Points',0,3,False));
                  RunQuery('Call UpdatePatientColorPoints(%d ,%d)',[LocalParametrs.pr.DefaultCompany,IDPatient]);
             end;

        end;
        Close;
     finally
         Free;
     end
     Else if (IDAppointment>0) and (IDPatient<=0) then
     with OpenQuery('Select a.* from appointments a where a.idc=%d and a.IDy=%d and a.idP=%d',
                                     [LocalParametrs.PR.DefaultCompany,AIDY,IDAppointment]) do
     try
        Me.Open;
        if Me.RecordCount>0 then
        begin
             Me.Edit;
             IDPatient:=Me['IDPatient'].AsInteger;
             if Me['IDBranch'].AsInteger>0 then
                AIDBranch:=Me['IDBranch'].AsInteger;
             //IDAcc:=0;
             Acc_Num:=0;
             if Me['Attend'].AsInteger<>1 then
             begin
                  Me.Edit;
                  Me['AttendTime'].AsDateTime:=Now;
                  Me['Attend'].AsInteger:=1;
                  Me['AttendUser'].AsInteger:=LocalParametrs.PR.UserID;
                  Me.Post;
                  if (Me.ApplyUpdates(-1)=0) then
                  begin
                       adm.AddToUserSession(FormPermissionID,2008,
                          Me['IDC'].AsInteger,
                          Me['IDY'].AsInteger,
                          Me['IDBranch'].AsInteger,0,
                          IDAppointment,
                          0,0,'Save Appointment Attend',
                          Dm.PR_AsInteger('Points_Appt_Attend','Points',0,3,False));
                       RunQuery('Call UpdatePatientColorPoints(%d ,%d)',[LocalParametrs.pr.DefaultCompany,IDPatient]);
                  end;
             End;
        end;
        Close;
     finally
         Free;
     end
     Else if (IDAppointment<=0) and (IDPatient>0) then
     with OpenQuery('Select * from Patients where idc=%d and idP=%d',
                                     [LocalParametrs.PR.DefaultCompany,IDPatient]) do
     try
        Me.Open;
        if Me.RecordCount>0 then
        begin
             IDAcc:=Me['IDAcc'].AsInteger;
             IDMainAcc:=Me['IDMainAcc'].AsInteger;
             if Me['IDBranch'].AsInteger>0 then
                AIDBranch:=Me['IDBranch'].AsInteger;
             //IDAcc:=0;
             Acc_Num:=0;
        end;
        Close;
     finally
         Free;
     end;

     if IDAcc>0 then
     begin
          Result:=True;
          Exit;
     end;

     UseBufferForQuery:=True;
     if adm.PatientFilesByBranch then
     begin
          IDMainPatientsAcc:=0;

          if AIDBranch<=0 then
             AIDBranch:=adm.SelectPatientsAccountsByBranch;

          if AIDBranch>0 Then
             IDMainPatientsAcc:=QueryValueAsInteger('select IDMainPatientsAcc from Branchs b where b.IDC=%d and b.IDP=%d',
                                       [LocalParametrs.pr.DefaultCompany,AIDBranch])
     end Else
     if adm.PatientFilesByDepartment
     then begin
               if (IDMainAcc<=0) and (IDPatient>0) then
                  IDMainAcc:=QueryValueAsInteger('Select IDMainAcc from patients where idc=%d and idp=%d and IDAcc<=0',[LocalParametrs.pr.DefaultCompany,IDPatient]);

               if (IDMainAcc>0) and (IDMainPatientsAcc<=0) then
                  IDMainPatientsAcc:=IDMainAcc;

               if IDMainPatientsAcc<=0 then
               begin
                  if IDAppointment>0 //يتم فلترة الأقسام باستثناء الإدارية إن كان النداء من قبل موعد
                  then s:=' and d.Administration=0'
                  Else s:='';

                  s:=adm.PlugDB.SelectValueBySQL('Please Choose the default department','يرجى اختيار القسم الافتراضي',
                                   q,[LocalParametrs.pr.DefaultCompany,s],
                                   'AccountNameE','AccountNameA','','IDP');
                  if trim(s)<>'' then
                     IDMainPatientsAcc:=StrToIntDef(rightNo(s,True),0);
               end;

               {if CdAppointmentDetail['IDDoctor'].AsInteger>0
               then IDDoctor:=CdAppointmentDetail['IDDoctor'].AsInteger
               Else IDDoctor:=0;
               if IDDoctor>0
               then IDMainPatientsAcc:=QueryValueAsInteger('Select IDMainPatientsAcc from employees e inner join departments d on (e.IDC,e.ID_Dept)=(d.IDC,d.IDP) where e.IDC=%d and e.IDP=%d',
                                            [LocalParametrs.pr.DefaultCompany,IDDoctor])
               Else IDMainPatientsAcc:=0;}
          end;
     if IDMainPatientsAcc<=0 then
     begin
          ShowError('ID Main Patients Account Folder not exist','رقم الحساب الرئيسي للمرضى غير معرف ');
          Exit;
     end;


     With OpenQuery('Call CreatePatientFileNo (%d,%d,%d)',[LocalParametrs.PR.DefaultCompany,IDMainPatientsAcc,IDPatient],true) do
     begin
          try
          adm.AddToUserSession(FormPermissionID,2040,
             LocalParametrs.PR.DefaultCompany,
             LocalParametrs.PR.DefaultFinancialYear,
             LocalParametrs.PR.DefaultBranch,0,
             IDPatient,
             0,0,'Create Patient File For IDAppointment='+Inttostr(IDAppointment),
             Dm.PR_AsInteger('Points_Patient_CreateNewFile','Points',0,3,False));
          first;
          while not eof do
          begin
               IDAcc:=Me['IDAcc'].AsInteger;
               Acc_Num:=ME['Ac_Num'].AsInteger;
               R:=Me['Result'].AsInteger;
               Result:=True;
               next;
          end;
          close;
          finally
                 free;
          end;

     end;


     adm.CheckCreatingPatientFile(R,IDPatient);


     //DatasetToPA;


end;



************ black list ************* save
procedure TForm_ApptsSystem.ActionAddToBlackListExecute(Sender: TObject);
var Classification:integer;
    Description:String;
  function aa:boolean;
  var Args: TVarArgs;// of Variant;
  begin
       result:=False;
       setLength(Args,2);
       Args[0]:='إضافة المريض إلى القائمة السوداء';
       Args[1]:='0';
       if InputQuery('','',['Description','Classification%ComboNormal=0,Important=1,SP=2,Bad=3,Very Bad=4'],['',''],Args) then
       begin
            Description:=Args[0];
            Classification:=Args[1];
            result:=true;
       end;
  end;

var DoctorsList,DoctorsListOld:Tstrings;
    DoctorsIDList:TstringList;
    s,ss,a,sn:String;
    IDPatient,i:integer;
begin
     //if not (DsMain.State in [dsinsert,dsEdit]) and not DsMain.AutoEdit then exit;

     IDPatient:=CDPatients['IDP'].AsInteger;
     s:='';a:='';

     with OpenQuery('select ID,IDDoctor,IDPatient from patientsblacklist where IDC=%d and IDPatient=%d ',[PR.DefaultCompany,IDPatient]) do
     begin
          open;
          first;
          while not Eof do
          begin
               CommaConcatS(a,ME['IDDoctor'].AsString);
               Next;
          end;
          close;
          free;
     end;
     if a<>'' then
        a:=','+a+',';

     DoctorsList   :=TstringList.Create;
     DoctorsListOld:=TstringList.Create;
     DoctorsIDList :=TstringList.Create;
     if (Pos(',0,',a)>0)
     then DoctorsList.Add('All|الكل|True')
     Else DoctorsList.Add('All|الكل|False');
     DoctorsIDList.Add('0');

     with OpenQuery('Select IDP,SName,Full_Name_Eng,Full_Name_Ar from Employees where IDC=%d and ID_Job=7 and Emp_Status in(0,1)',[PR.DefaultCompany]) do
     begin
          open;
          first;
          while not Eof do
          begin
               if IsNo(ME['SName'].AsString) and not Same(Trim(ME['Full_Name_Eng'].AsString),Trim(ME['SName'].AsString))
               then sn:=ME['SName'].AsString+'-'
               Else sn:='';

               if (sn<>'') and Same(Trim(ME['Full_Name_Eng'].AsString),Trim(ME['SName'].AsString))
               then ss:=sn+'|'+sn
               Else ss:=sn+ME['Full_Name_Eng'].AsString+'|'+sn+ME['Full_Name_Ar'].AsString;

               if Pos(','+ME['IDP'].AsString+',',a)>0
               then begin
                         ss:=ss+'|True';
                         DoctorsList[0]:='All|الكل|False';
                    end
               Else ss:=ss+'|False';


               DoctorsList.Add(ss);
               DoctorsIDList.Add(ME['IDP'].AsString);
               Next;
          end;
          close;
          free;
     end;

     DoctorsListOld.Text:=DoctorsList.Text;

     if (DoctorsList.Count>0) and
        ShowOkCancel('Select Blocked Doctors for this patient',
                     'اختر الأطباء المحجوبين  الذين ترغب بحجبهم عن عذا المريض',DoctorsList,[],'') then
     begin
          if not same(DoctorsListOld.Text,DoctorsList.Text) and aa then
          begin
               RunQuery('Delete p from Patientsblacklist p where IDC=%d and IDPatient=%d',[PR.DefaultCompany,IDPatient]);

               s:='';
               for i := 0 to DoctorsIDList.Count-1 do
               begin
                    if CPos('True',DoctorsList[i])>0 then
                    begin
                         RunQuery('insert into patientsblacklist (IDC, IDUser, ADate, Active, IDPatient, IDDoctor, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description) '+
                                  'Select IDC, IDUser, "%s", 1, IDP, %s, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description from patients where IDC=%d and IDP=%d',
                                  [DateTimeToSQL(adm.ServerDateTime),DoctorsIDList[i],PR.DefaultCompany,IDPatient]);

                         if i=0 then
                            break;
                    end;
               end;
               adm.AddToUserSession(ActionManager1.PermissionID,3397,
                pr.DefaultCompany,pr.DefaultFinancialYear,pr.DefaultBranch,0,
                0,0,
                0,'New Black List For IDPatient='+CDAppointmentsView['IDPatient'].AsString,
                Dm.PR_AsInteger('Points_Patient_AddToBlackList','Points',0,1,False));
          end;
     end;

     DoctorsIDList.Free;
     DoctorsList.Free;
     DoctorsListOld.Free;

end;