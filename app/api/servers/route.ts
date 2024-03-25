import {v4 as uuidv4} from  'uuid';
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from '@prisma/client';
import { NextRequest} from "next/server";
import error from 'next/error';

export async function POST(req: Request) {
    try {
        const {name,imageUrl}= await req.json();
        const profile =await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});

        }
        const server= await db.server.create({
            data:{
                profileId:profile.id,
                name,
                imageUrl,
                invitecode: uuidv4(),
                channels:{
                    create:[
                        {name:"general", profileId:profile.id},
                    ]
                },
                members:{
                    create:[
                        {profileId:profile.id, role:MemberRole.ADMIN}
                    ]
                }
            }
        });
        
        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]",error);
        return new NextResponse("Internal Error",{status:500});
        
    }
    
}
export async function GET(){
    return NextResponse.json({"Hello" : "Welcome from Servers"});
}