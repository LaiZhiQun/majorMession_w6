import{_ as l,o as c,c as m,a as p,d as s,i,j as d,g as u,F as _}from"./index-23b8ee70.js";const{VITE_APP_URL:h}={VITE_APP_URL:"https://vue3-course-api.hexschool.io/",VITE_APP_PATH:"brad5566",BASE_URL:"/majorMession_w6/",MODE:"production",DEV:!1,PROD:!0},f={data(){return{username:"",password:""}},methods:{login(){this.$http({method:"post",url:`${h}admin/signin`,data:{username:this.username,password:this.password}}).then(o=>{const{token:e,expired:r}=o.data;document.cookie=`myToken=${e};expires=${new Date(r)}; path=/`,alert(o.data.message),this.$router.push("/admin/products")}).catch(o=>{alert(o.response.data.message)})}}},w={class:"container"},g={class:"row justify-content-center"},b=s("h1",{class:"h3 mb-3 font-weight-normal"}," 請先登入 ",-1),x={class:"col-8"},P={id:"form",class:"form-signin"},v={class:"form-floating mb-3"},V=s("label",{for:"username"},"Email address",-1),E={class:"form-floating"},T=s("label",{for:"password"},"Password",-1),k=s("p",{class:"mt-5 mb-3 text-muted"}," © 2021~∞ - 六角學院 ",-1);function y(o,e,r,A,a,n){return c(),m(_,null,[p(" 這是登入畫面 "),s("div",w,[s("div",g,[b,s("div",x,[s("form",P,[s("div",v,[i(s("input",{"onUpdate:modelValue":e[0]||(e[0]=t=>a.username=t),type:"email",class:"form-control",id:"username",placeholder:"name@example.com",required:"",autofocus:""},null,512),[[d,a.username]]),V]),s("div",E,[i(s("input",{"onUpdate:modelValue":e[1]||(e[1]=t=>a.password=t),type:"password",class:"form-control",id:"password",placeholder:"Password",required:""},null,512),[[d,a.password]]),T]),s("button",{onClick:e[2]||(e[2]=u((...t)=>n.login&&n.login(...t),["prevent"])),class:"btn btn-lg btn-primary w-100 mt-3",type:"submit"}," 登入 ")])])]),k])],64)}const U=l(f,[["render",y]]);export{U as default};