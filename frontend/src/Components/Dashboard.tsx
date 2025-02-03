import axios from 'axios';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, setTransactions } from '../features/transactionsSlice';
import { AppDispatch, RootState } from '../store';

import { addMessage } from '../features/webSocketSlice';
import TransactionForm from './TransactionForm';
import { port } from '../config';


const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const transaction  = useSelector((state:RootState)=>state.transactions.transactions);
    const webSocketMessages = useSelector((state:RootState)=>state.webSocket.messages);

    useEffect(() => {
        let mounted:boolean = true;


       //fetching transactions


      

       const fetchTransaction = async()=>{
        const response = await axios.get(`http://localhost:${port}/api/transactions`,{headers:{Authorization:localStorage.getItem("token")}});
        try {
            console.log("response",response.data);
            if(mounted)
            dispatch(setTransactions(response.data.transactions));
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
        
        
       }
       
      fetchTransaction();

      return ()=>{
        mounted = false;
      }
    }, [dispatch])

    // socket connection

    useEffect(()=>{
        const ws = new WebSocket(`ws://localhost:${port}`);
        
        ws.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            console.log("Data from WebSocket",data);
            if(data.type === "transaction"){
                dispatch(addTransaction(data.payload));
            }
            else if(data.type === "message"){
                dispatch(addMessage(data.payload));
            }
    
            
        };
        return ()=> ws.close();
    },[dispatch]);
    

    
    
  return (
    <div className="p-6 bg-blue-100 h-full overflow-x-hidden">
        
        <h1 className="text-2xl font-bold mb-4  text-center">Dashboard</h1>
         {/* adding all Transactions list */}

         <div>
            <h2 className="text-xl font-semibold">Transactions</h2>
            <h4 className='text-md font-semibold mt-2 '> Number of transactions {`${transaction.length}`}</h4>
            <div className='mt-2 h-64 overflow-y-auto border border-gray-300 rounded-4xl p-2'>
            <ul className=" flex flex-col items-center justify-center text-center mt-4 gap-y-2 ">
                {
                  transaction.length>0 ? transaction?.map((txn)=>(
                        <li key={txn.id} className="border p-4 rounded-lg shadow-sm flex justify-between w-xl mt-2">
                             <span>{txn.description}</span>
                             <span>💵{txn.amount.toFixed(2)}</span>
                        </li>
                    )):<>
                    <li className="border p-4 rounded-lg shadow-sm">No Transactions... <br />Please add some transactions</li>
                    
                    </>
                }   
            </ul>
            </div>
            
         </div>
          
         {/* adding all WebSocket messages */}
         <div>

            <h2 className="mt-10 text-xl font-semibold">Live Messages</h2>

            <ul className="mt-4 gap-y-2">
                {
                    webSocketMessages?.map((msg,index)=>(
                    <li key={index} className="border p-2 rounded-lg bg-blue shadow-sm">
                        {msg}
                    </li>))
                }

            </ul>

         </div>

         <div className='mt-20'>
         <TransactionForm/>
         </div>
         
    </div>
  )
}

export default Dashboard;