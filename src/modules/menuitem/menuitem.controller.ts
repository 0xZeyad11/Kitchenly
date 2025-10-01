import {
  createMenuItem,
  getAllMenuItems,
  deleteMenuItem,
  updateMenuItem,
  getMenuItem,
  getAllMenuItemsAdmin,
} from "./menuitem.repository";
import { buildPrismaQuery } from "../../common/utils/queryBuilder";
import { catchAsync } from "../../common/utils/catchAsync";
import {Request , Response , NextFunction} from 'express' ;
import { MenuItemSchema  , CreateMenuItemInput , UpdateMenuSchema} from "./menuitem.schema";
import AppError from "../../common/utils/AppError";

export const CreateNewItem = catchAsync(
    async(req: Request , res:Response , next:NextFunction) => {
     const validdata = MenuItemSchema.safeParse(req.body) ; 
     if(!req.user){
      return next(new AppError("There is no logged in user to complete this action",401));
     }
     if(!validdata.success){
       return next(new AppError("Invalid Menu Item data", 400));
     }
     const data = validdata.data as CreateMenuItemInput ; 
     const MenuItemPrismaData = {
      name : data.name , 
      description: data.description , 
      price: data.price,
      foodType: data.foodType , 
      itemType: data.itemType,
      chief: {
        connect:{
          id: req.user.id,
        }
      }
     }; 

     const menuitem = await createMenuItem(MenuItemPrismaData)

     res.status(200).json({
      status: "Success",
      data: menuitem,
     })
    }
)

export const DeleteMenuItem  = catchAsync(
  async(req:Request , res:Response, next:NextFunction) => {
    const id = req.params.id ; 

    const finditem = await getMenuItem(id , req.params.chiefid) ; 
    if(!finditem){
      return next(new AppError("Could not find this item for deleting!!" ,404)) ; 
    }
    const delteitem  = await deleteMenuItem(finditem.id); 
    res.status(204).json({
      status: "Success",
      message: "Item has been deleted successfully!"
    })
  }
);


export const GetMenuItemByID = catchAsync(
  async(req:Request,res:Response ,next:NextFunction) => {
    const id = req.params.id ; 
    const user = req.user ; 
    if(!user || user.role !== 'CHIEF'){
      return next(new AppError("This chief doesn't exists!" , 404));
    }
    const finditem = await getMenuItem(id , user.id);  
    if(!finditem){
      return next(new AppError("Could not find this item for deleting!!" ,404)) ; 
    }
    res.status(200).json({
      status: 'Success',
      data: finditem
    })
  }
)

export const GetAllMenuItems = catchAsync(
  async(req:Request, res:Response , next: NextFunction) =>{
    const options = buildPrismaQuery(req.query);
    const chiefid = req.params.chiefid;
    const allMenuItems = await getAllMenuItems(options , chiefid);
    res.status(200).json({
      status: "Success", 
      length: allMenuItems.length,
      data: allMenuItems
    })
  }
)

export const UpdateMenuItem = catchAsync(
  async (req:Request , res: Response , next:NextFunction) => {
    const id = req.params.id ; 
    let filtereddata  ; 
    let chiefid ; 
    if(req.body.chief_id){
      const {chief_id , ...rest} = req.body ; 
      filtereddata = rest ;
      chiefid = chief_id ; 
    }
    const validData = UpdateMenuSchema.safeParse(filtereddata);
    if(!validData.success){
      return next(new AppError(`Invalid data for updating the menu item` , 400));
    }
    const finditem = await getMenuItem(id , chiefid) ; 
    if(!finditem){
      return next(new AppError('Can not find this item!!' , 404));
    }
    const updateItem = await updateMenuItem(validData.data , id) ;
    res.status(200).json({
      status: 'success',
      data: updateItem 
    })
    
  }
)

export const GetAllMenuItemsAdmin = catchAsync(
  async(req:Request , res:Response, next:NextFunction) => {
    const options = buildPrismaQuery(req.query);
    const data = await getAllMenuItemsAdmin(options); 
    res.status(200).json({
      status: 'success',
      data
    })
  }
)