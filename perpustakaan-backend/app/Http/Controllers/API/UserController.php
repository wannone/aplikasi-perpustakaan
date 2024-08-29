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
use Illuminate\Support\Facades\DB;



class UserController extends Controller
{

    public function index()
    {
        try {
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

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email'     => 'required',
                'password'  => 'required'
            ]);
    
            $credentials = $request->only('email', 'password');
    
            if(!$token = auth()->guard('api')->attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email atau Password Anda salah'
                ], 401);
            }
    
            return response()->json([
                'success' => true,
                'data'    => auth()->guard('api')->user(),    
                'token'   => $token   
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error: ' . $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
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
    
            //create user
            $user = User::create([
                'nama'      => $request->nama,
                'role_id'   => $request->role_id,
                'email'     => $request->email,
                'password'  => bcrypt($request->password)
            ]);
    
            return response()->json([
                'data' => true,
                'user'    => $user,  
            ], 200);
            

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error: ' . $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
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
        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error: ' . $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show (int $id) {
        try {
            $user = User::find($id);
    
        if ($user) {
            return response()->json([
                'success' => true,
                'data'    => $user
            ]);
        }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
}