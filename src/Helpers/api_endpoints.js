let apis = {
  // triggers lambda function: ChangeSponsorshipsInfo
  ChangeSponsorshipInfo:
    'https://thuv0o9tqa.execute-api.us-east-1.amazonaws.com/dev/updatesponsorshipinfo',

  // triggers lambda function: ChangeUserInfo
  ChangeUserInfo:
    'https://u902s79wa3.execute-api.us-east-1.amazonaws.com/dev/saveuserdetails',

  // triggers lambda function: CreateUser
  CreateCognitoIdentity:
    'https://t4jjmnr8e5.execute-api.us-east-1.amazonaws.com/dev/createuser',

  // triggers lambda function: createNewSponsorship
  CreateNewSponsorship:
    'https://nrpwjk1izl.execute-api.us-east-1.amazonaws.com/dev/createnewsponsorship',

  // triggers lambda function: CreateOrder
  CreateOrder:
    'https://jbcqty2yxb.execute-api.us-east-1.amazonaws.com/dev/createorder',

  // triggers lambda function: GetAllUserData
  GetAllUserData:
    'https://wdukos3oed.execute-api.us-east-1.amazonaws.com/dev/getalluserdata',

  // triggers lambda function: sponsorList
  GetAllSponsorData:
    'https://2cw17jd576.execute-api.us-east-1.amazonaws.com/dev/sponsorlist',

  // triggers lambda function: appList
  GetApplicationsBySponsor:
    'https://unmqqiwf1a.execute-api.us-east-1.amazonaws.com/dev/applist?Username=',

  // triggers lambda function: GetCatalogItems
  GetCatalogItems:
    'https://bfv61oiy3h.execute-api.us-east-1.amazonaws.com/dev/getcatalogitems?SponsorID=',

  // triggers lambda function: DriverDataBySponsor
  GetDriverDataBySponsor:
    'https://rb6nqfuvvg.execute-api.us-east-1.amazonaws.com/dev/driverdatabysponsor?SponsorUsername=',

  // triggers lambda function: GetEbayItemsByIDs
  GetEbayItemsByIDs:
    'https://emdjjz0xd8.execute-api.us-east-1.amazonaws.com/dev/getebayitemsbyproductids',

  // triggers lambda function: GetItemsFromEbay
  GetItemsFromEbay:
    'https://0hcub33ona.execute-api.us-east-1.amazonaws.com/dev/ebay',

  // triggers lambda function: GetOrder
  GetOrder:
    'https://45mkccncmi.execute-api.us-east-1.amazonaws.com/dev/getorder',

  // triggers lambda function: GetOrganizationNames
  GetOrganizationNames:
    'https://asellofio4.execute-api.us-east-1.amazonaws.com/dev/getorganizationnames',

  // triggers lambda function: GetOrgSponsors
  GetOrgSponsors: `https://xqgw415uwe.execute-api.us-east-1.amazonaws.com/dev/getorgsponsors?Organization=`,

  // triggers lambda function: GetOrgUserData
  GetOrgUserData:
    'https://xqgw415uwe.execute-api.us-east-1.amazonaws.com/dev/getorguserdata?Organization=',

  // triggers lambda function: getPointHistoryBySonsorship (getPointHistoryBySonsorshi in exported lambda functions) [ don't mind the typo :) ]
  GetPointHistoryBySonsorship:
    'https://b428t56xa7.execute-api.us-east-1.amazonaws.com/dev/getpointhistorybysponsorship',

  // triggers lambda function: GetSponsorshipDetails
  GetSponsorshipDetails:
    'https://8mhdaeq2kl.execute-api.us-east-1.amazonaws.com/dev/getuserdetails',

  // triggers lambda function: GetUsernames
  GetUsernames:
    'https://hym6oy13e9.execute-api.us-east-1.amazonaws.com/dev/getusernames',

  // triggers lambda function: checkTest
  SendCheckoutEmail:
    'https://mwsws12vm3.execute-api.us-east-1.amazonaws.com/dev/checkoutEmail',

  // triggers lambda function: SetCatalogItems
  SetCatalogItems: `https://4hw5o2emwe.execute-api.us-east-1.amazonaws.com/dev/setcatalogitems`,

  // triggers lambda function: SetOrder
  SetOrder:
    'https://t1nrlz2fl4.execute-api.us-east-1.amazonaws.com/dev/setorder',

  // triggers lambda function: SubmitApp
  SubmitApplication:
    'https://z8yu8acjwj.execute-api.us-east-1.amazonaws.com/dev/submitapplication',

  // triggers lambda function: UpdateOrgName
  UpdateOrgName:
    'https://waza1dohpl.execute-api.us-east-1.amazonaws.com/dev/updateorgname',

  // triggers lambda function: UpdateSponsorshipPointRatio (UpdateSponsorshipPR in exported functions)
  UpdateSponsorshipPDR:
    'https://q8z2hne254.execute-api.us-east-1.amazonaws.com/dev/updatesponsorship',

  // triggers lambda function: UserSignup
  UserSignup:
    'https://thuv0o9tqa.execute-api.us-east-1.amazonaws.com/dev/saveuserdetails',
}

export default apis
