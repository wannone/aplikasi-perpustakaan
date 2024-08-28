<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Roles;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;


class UserController extends Controller
{

    public function index()
    {
        $users = User::with("role")->get();

        $users = $users->map(function($item) {
            return [
                'user_id' => $item->user_id,
                'role' => $item->role->nama,
                'nama' => $item->nama,
                'email' => $item->email,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $users
        ]);
    }

    public function login(Request $request)
    {
        //set validation
        $validator = Validator::make($request->all(), [
            'email'     => 'required',
            'password'  => 'required'
        ]);

        //if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        //get credentials from request
        $credentials = $request->only('email', 'password');

        //if auth failed
        if(!$token = auth()->guard('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password Anda salah'
            ], 401);
        }

        //if auth success
        return response()->json([
            'success' => true,
            'data'    => auth()->guard('api')->user(),    
            'token'   => $token   
        ], 200);
    }

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nama'      => 'required',
                'email'     => 'required|email|unique:users',
                'password'  => 'required|min:8|confirmed',
                'role_id'   => 'required|exists:roles,role_id'
            ]);
    
            //if validation fails
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
    
            //create user
            $user = User::create([
                'nama'      => $request->nama,
                'role_id'   => $request->role_id,
                'email'     => $request->email,
                'password'  => bcrypt($request->password)
            ]);
    
            //return response JSON user is created
            if($user) {
                return response()->json([
                    'data' => true,
                    'user'    => $user,  
                ], 201);
            }
    
            //return JSON process insert failed 
            return response()->json([
                'success' => false,
            ], 409);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database query exceptions (e.g., foreign key constraint failures)
            return response()->json([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
    
        } catch (\Exception $e) {
            // Handle any other general exceptions
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
        }
       
    }


    public function logout(Request $request)
    {        
        //remove token
        $removeToken = JWTAuth::invalidate(JWTAuth::getToken());

        if($removeToken) {
            //return response JSON
            return response()->json([
                'success' => true,
                'message' => 'Logout Berhasil!',  
            ]);
        }
    }

    public function update(Request $request, int $id){
        $user = User::find($id);

        if ($user) {

            $validator = Validator::make($request->all(), [
                'nama'      => 'required',
                'email'     => 'required|email|unique:users,email,' . $id . ',user_id',
                'role_id'   => 'required|exists:roles,role_id',
            ]);

            $user->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'User berhasil diupdate',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan',
        ], 404);    
    }

    public function show (int $id) {
        $user = User::find($id);
    
        if ($user) {
            return response()->json([
                'success' => true,
                'data'    => $user
            ]);
        }
    }

    public function destroy(int $id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User berhasil dihapus',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan',
        ], 404);
    }
}